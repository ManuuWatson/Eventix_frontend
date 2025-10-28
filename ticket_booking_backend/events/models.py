from django.db import models

class Event(models.Model):
    name = models.CharField(max_length=255)
    host_name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    date = models.DateField()
    location = models.CharField(max_length=255)
    poster = models.ImageField(upload_to='event_posters/', blank=True, null=True)  # ✅ image upload field
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def poster_url(self):
        """Return full URL for event poster (for frontend display)."""
        if self.poster and hasattr(self.poster, 'url'):
            return self.poster.url
        return None

    def __str__(self):
        return self.name


class TicketType(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='ticket_types')
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.IntegerField()

    def __str__(self):
        return f"{self.name} - {self.event.name}"

    def available_tickets(self):
        booked_tickets = self.bookings.aggregate(total=models.Sum('quantity'))['total'] or 0
        return self.quantity - booked_tickets
