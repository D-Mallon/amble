from django.contrib import admin
from django.urls import path, re_path, include
from users import views

urlpatterns = [
    re_path(r'^users/$', views.user_view),
    re_path(r'^api/users/(?P<pk>[0-9]+)$', views.user_view),
    path('users', views.user_view),
]


    