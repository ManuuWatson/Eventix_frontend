# events/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from .models import Event
from .serializers import EventSerializer
import json


@method_decorator(csrf_exempt, name='dispatch')
class EventView(View):
    def get(self, request, event_id=None):
        if event_id:
            try:
                event = Event.objects.get(id=event_id)
                serializer = EventSerializer(event)
                return JsonResponse(serializer.data, safe=False)
            except Event.DoesNotExist:
                return JsonResponse({'error': 'Event not found'}, status=404)
        else:
            events = Event.objects.all().order_by('date')
            serializer = EventSerializer(events, many=True)
            return JsonResponse(serializer.data, safe=False)

    def post(self, request):
        """
        Create a new event. Accepts JSON with:
          - name, host_name, description, date, location
          - poster OR poster_url (base64 data URL)
          - ticket_types: [{name, price}, ...]  (quantity optional)
          - status (optional) -> maps to is_approved (approved => True, else False)
        """
        try:
            data = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        # Accept either 'poster' or 'poster_url'
        if 'poster_url' in data and not data.get('poster'):
            data['poster'] = data.pop('poster_url')

        # Map 'status' -> is_approved
        status = data.get('status')
        if status is not None:
            if isinstance(status, str) and status.strip().lower() == 'approved':
                data['is_approved'] = True
            else:
                data['is_approved'] = False
            data.pop('status', None)
        else:
            data['is_approved'] = False

        # If ticket_types present, ensure they are list of dicts (validation will check content)
        serializer = EventSerializer(data=data)
        if serializer.is_valid():
            event = serializer.save()
            return JsonResponse(EventSerializer(event).data, status=201)
        else:
            # return serializer errors to help debugging on frontend
            return JsonResponse({'errors': serializer.errors}, status=400)

    def put(self, request, event_id):
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return JsonResponse({'error': 'Event not found'}, status=404)

        try:
            data = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        if 'poster_url' in data and not data.get('poster'):
            data['poster'] = data.pop('poster_url')

        status = data.get('status')
        if status is not None:
            if isinstance(status, str) and status.strip().lower() == 'approved':
                data['is_approved'] = True
            else:
                data['is_approved'] = False
            data.pop('status', None)

        serializer = EventSerializer(event, data=data, partial=True)
        if serializer.is_valid():
            updated = serializer.save()
            return JsonResponse(EventSerializer(updated).data)
        else:
            return JsonResponse({'errors': serializer.errors}, status=400)

    def delete(self, request, event_id):
        try:
            event = Event.objects.get(id=event_id)
            event.delete()
            return JsonResponse({'message': 'Event deleted successfully'})
        except Event.DoesNotExist:
            return JsonResponse({'error': 'Event not found'}, status=404)
# events/serializers.py