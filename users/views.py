from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import User, UserPreferences #, UserRoute
from .serializers import UserSerializer, UserPreferencesSerializer #, UserRouteSerializer
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest

from .algorithm import *

#Function to view user registration data
@api_view(['GET', 'POST'])
def registration(request):
    if request.method == 'GET':
        user = User.objects.all()
        serializer = UserSerializer(user, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = User.objects.all()
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    return HttpResponseBadRequest('Unsupported request method.')

#Function to view user route data
def handle_routeinpput_data(request):
    if request.method == 'POST':
        latitude = request.POST.get("latitude")
        longitude = request.POST.get("longitude")
        hour = request.POST.get("hour")
        response_data = {"waypoints": magic(float(latitude), float(longitude), str(hour))}
        return JsonResponse(response_data)
    
#Function to view user preferences data
@api_view(['GET', 'POST'])
def preferences(request):
    if request.method == 'GET':
        preferences = UserPreferences.objects.all()
        serializer = UserPreferencesSerializer(preferences, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = UserPreferences.objects.all()
        serializer = UserPreferencesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    return HttpResponseBadRequest('Unsupported request method.')
