from django.contrib import admin
from django.urls import path, re_path, include
from . import views

urlpatterns = [
        path('users/preferences', views.preferences),
        path('users/registration', views.registration),
        path('users/logincheck', views.logincheck),
        path('users', views.handle_routeinpput_data),
]
