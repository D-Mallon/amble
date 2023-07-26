"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic.base import TemplateView 
from users import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/preferences', views.preferences),
    path('users/registration', views.registration),
    path('users/logincheck', views.logincheck),
    path('users/getquote', views.getquote),
    path('users/handle_routeinpput_data', views.handle_routeinpput_data),
    
    path("loginCheck", TemplateView.as_view(template_name="base.html")),
    path("userpref", TemplateView.as_view(template_name="base.html")),
    path("", TemplateView.as_view(template_name="base.html")),
    path("login", TemplateView.as_view(template_name="base.html")),
    path("comms", TemplateView.as_view(template_name="base.html")),
    path("interface", TemplateView.as_view(template_name="base.html")),
    path("homepage", TemplateView.as_view(template_name="base.html")),
    path("showroute", TemplateView.as_view(template_name="base.html")),
    path("landingpage", TemplateView.as_view(template_name="base.html")),
    path("resources", TemplateView.as_view(template_name="base.html")),
    path("quotes", TemplateView.as_view(template_name="base.html")),
    path("signup", TemplateView.as_view(template_name="base.html")),
    path("signin", TemplateView.as_view(template_name="base.html")),
]
