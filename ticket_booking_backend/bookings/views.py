from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse

def placeholder(request):
    return JsonResponse({"message": "Bookings API coming soon"})
