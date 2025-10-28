# events/serializers.py
import base64
import uuid
from django.core.files.base import ContentFile
from rest_framework import serializers
from .models import Event, TicketType
from datetime import datetime


class Base64ImageField(serializers.ImageField):
    def to_internal_value(self, data):
        if hasattr(data, 'read'):
            return super().to_internal_value(data)

        if not data:
            return None

        if isinstance(data, str) and data.startswith('data:'):
            try:
                header, base64_data = data.split(',', 1)
                data = base64_data
            except ValueError:
                raise serializers.ValidationError('Invalid data URL for image.')

        if isinstance(data, str):
            try:
                decoded_file = base64.b64decode(data)
            except (TypeError, ValueError) as exc:
                raise serializers.ValidationError('Invalid base64 string') from exc

            file_name = f"{uuid.uuid4().hex[:12]}.png"
            content_file = ContentFile(decoded_file, name=file_name)
            return super().to_internal_value(content_file)

        raise serializers.ValidationError('Invalid type for image field')


class TicketTypeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    quantity = serializers.IntegerField(required=False, default=0)

    class Meta:
        model = TicketType
        fields = ('id', 'name', 'price', 'quantity')


class EventSerializer(serializers.ModelSerializer):
    ticket_types = TicketTypeSerializer(many=True, required=False)
    poster = Base64ImageField(required=False, allow_null=True)
    poster_url = serializers.SerializerMethodField()  # ✅ added field

    class Meta:
        model = Event
        fields = (
            'id', 'name', 'host_name', 'description',
            'date', 'location', 'poster', 'poster_url',  # ✅ added poster_url here
            'is_approved', 'created_at', 'ticket_types'
        )
        read_only_fields = ('id', 'created_at',)

    def get_poster_url(self, obj):
        """Return the absolute URL for the uploaded image"""
        request = self.context.get('request')
        if obj.poster and hasattr(obj.poster, 'url'):
            if request:
                return request.build_absolute_uri(obj.poster.url)
            return obj.poster.url
        return None

    def _normalize_date(self, value):
        if value is None or value == '':
            return None
        if isinstance(value, str):
            try:
                if 'T' in value:
                    dt = datetime.fromisoformat(value)
                    return dt.date().isoformat()
                else:
                    return datetime.fromisoformat(value).date().isoformat()
            except Exception:
                return value.split('T')[0]
        return value

    def validate_date(self, value):
        normalized = self._normalize_date(value)
        return normalized

    def create(self, validated_data):
        ticket_types_data = validated_data.pop('ticket_types', [])
        poster = validated_data.pop('poster', None)

        event = Event.objects.create(**validated_data)
        if poster:
            event.poster = poster
            event.save()

        for tt in ticket_types_data:
            quantity = tt.get('quantity', 0)
            TicketType.objects.create(
                event=event,
                name=tt['name'],
                price=tt['price'],
                quantity=quantity
            )

        return event

    def update(self, instance, validated_data):
        ticket_types_data = validated_data.pop('ticket_types', None)
        poster = validated_data.pop('poster', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if poster:
            instance.poster = poster

        instance.save()

        if ticket_types_data is not None:
            instance.ticket_types.all().delete()
            for tt in ticket_types_data:
                quantity = tt.get('quantity', 0)
                TicketType.objects.create(
                    event=instance,
                    name=tt['name'],
                    price=tt['price'],
                    quantity=quantity
                )

        return instance
