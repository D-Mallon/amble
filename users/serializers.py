from rest_framework import serializers
from .models import User, UserPreferences  #, UserRoute

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name','last_name', 'email', 'address', 'password', 'registrationDate')
        #fields = ('__all__')

class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = ('park','library','worship','community','museum','walking_node','park_node')
        #fields = ('__all__')

# class UserRouteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserRoute
#         fields = ('id','latitude', 'longitude', 'distance','hour')
#         #fields = ('__all__')