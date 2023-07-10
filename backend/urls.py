"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import TemplateView 
from users.views import user_view, user_route

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('users.urls')),
    # path('users/',user_view),
    # path('users/',user_route),
    
    path("", TemplateView.as_view(template_name="base.html")),
    path("latlondis", TemplateView.as_view(template_name="base.html")),
    path("login", TemplateView.as_view(template_name="base.html")),
    
]
