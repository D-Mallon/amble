from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import User, UserPref, UserRoute
from .serializers import UserSerializer, UserPreferencesSerializer, UserRouteSerializer
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
from .algorithm import *

# from django.contrib.auth import authenticate, login, get_user_model
# from .custom_auth_backend import CustomModelBackend 
# from django.contrib.auth.models import User

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
        preferences = UserPref.objects.all()
        serializer = UserPreferencesSerializer(preferences, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.POST
        response_data = {'Preferences': data}
        return JsonResponse(response_data)
    else:
        return JsonResponse({'Error': 'Invalid Request'})
        # return Response(status=status.HTTP_201_CREATED)
    #     data = UserPref.objects.all()
    #     serializer = UserPreferencesSerializer(data=request.data)
    #     # return Response(status=status.HTTP_201_CREATED)
    #     if serializer.is_valid():
    #         # return Response(status=status.HTTP_201_CREATED)
    #         serializer.save()
    #         return Response(status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # return HttpResponseBadRequest('Unsupported request method.')

def logincheck(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = CustomModelBackend().authenticate(request, email=email, password=password)

        if user is not None:
            if user.check_password(password):
            # Login successful
                login(request, user)
                return JsonResponse({'message': 'Login successful'})
        else:
            # Login failed
            return JsonResponse({'error': 'Invalid email or password'}, status=401)

    # Return a 405 Method Not Allowed response for non-POST requests
    return JsonResponse({'error': 'Method not allowed'}, status=405)
