"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic.base import TemplateView 
from users import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('users.urls')),
    path('users', views.user_view),
    path('api/users/', views.user_view),
    re_path(r'^api/users/(?P<pk>[0-9]+)$', views.user_view),
    path("", TemplateView.as_view(template_name="base.html")),
    path("latlondis", TemplateView.as_view(template_name="base.html")),
    path("login", TemplateView.as_view(template_name="base.html")),
    path("comms", TemplateView.as_view(template_name="base.html")),
]
