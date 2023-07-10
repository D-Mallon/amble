from django.contrib import admin
from django.urls import path
from .views import user_view, user_route

urlpatterns = [
path('users', user_route, name ='user_route'), 
path('users', user_view, name ='user_view'),
    
]


    