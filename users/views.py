from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import User
from .serializers import UserSerializer
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest

from .algorithm import *

#Function to view user input data
@api_view(['GET', 'POST'])
def user_view(request):
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

def handle_routeinpput_data(request):
    if request.method == 'POST':
        latitude = request.POST.get('latitude')
        longitude = request.POST.get('longitude')
        distance = request.POST.get('distance')

        print(f'Latitude: {latitude} Longitude: {longitude} Distance: {distance} ') 
        print(f'Latitude: {type(latitude)} ') 

        response_data = {'sum': magic(int(latitude), int(longitude))}
        return JsonResponse(response_data)
