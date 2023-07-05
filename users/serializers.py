from rest_framework import serializers
from .models import User, UserRoute

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('pk', 'first_name','last_name', 'email', 'address', 'password', 'registrationDate')
        #fields = ('__all__')

class UserRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRoute
        fields = ('pk', 'latitude', 'longitude', 'distance')
        #fields = ('__all__')