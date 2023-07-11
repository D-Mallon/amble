from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
 
path('users', views.user_view), #, name ='user_view'
path('users', views.user_route),  #, name ='user_route'

]


    