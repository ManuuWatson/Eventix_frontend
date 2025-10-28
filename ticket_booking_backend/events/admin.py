from django.contrib import admin
from .models import Event, TicketType

class TicketTypeInline(admin.TabularInline):
    model = TicketType
    extra = 1
    fields = ('name', 'price')  # Removed payment method
    can_delete = True


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'host_name', 'date', 'location', 'is_approved')
    list_filter = ('is_approved', 'date')
    search_fields = ('name', 'host_name', 'location')
    readonly_fields = ('created_at',)
    inlines = [TicketTypeInline]
    actions = ['approve_events']

    fieldsets = (
        (None, {
            'fields': (
                'name',
                'host_name',
                'description',
                'date',
                'location',
                'poster',  # ✅ file upload field
                'is_approved',
            )
        }),
    )

    def approve_events(self, request, queryset):
        queryset.update(is_approved=True)
        self.message_user(request, "Selected events have been approved successfully ✅")

    approve_events.short_description = "Approve selected events"


@admin.register(TicketType)
class TicketTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'event', 'price')
    search_fields = ('name', 'event__name')
    list_filter = ('event',)