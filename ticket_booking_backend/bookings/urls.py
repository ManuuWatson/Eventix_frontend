from django.urls import path
from . import views

urlpatterns = [
    # Temporary placeholder until we add booking endpoints
    path('', views.placeholder, name='bookings-home'),
]
