from django.urls import path
from .views import EventView

urlpatterns = [
    path('', EventView.as_view(), name='event-list'),              # /api/events/
    path('<int:event_id>/', EventView.as_view(), name='event-detail'),  # /api/events/1/
]
