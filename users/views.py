from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import User, UserPref, UserRoute
from .serializers import UserSerializer, UserPreferencesSerializer, UserRouteSerializer
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
from .algorithm import *
from .access_db import *
import json

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
    if request.method == 'POST':
        prefdata = json.loads(request.body)
        # print(f'Data from the frontend = {prefdata} and its type = {type(prefdata)}')
        response_data = {'data_from_frontend': prefdata}
        with open("src/json-files/preferences.json", "w") as outfile:
            json.dump(response_data , outfile, indent=4)
        return JsonResponse(response_data)
    else:
        return JsonResponse({'Error': 'Invalid Request'})

#Function to check user login data versus what is stored in database    
def logincheck(request):
    if request.method == 'POST':
        checkdata = json.loads(request.body)
        username = checkdata['username']
        # print(f'This is the checkdata {checkdata}')
        password = checkdata['password']
        response_data = {"checks": checklogin(username,password)}
        # print(f'In views.logincheck the data is username = {username} and password = {password}')
        return JsonResponse(response_data)
