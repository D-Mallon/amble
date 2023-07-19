from django.contrib import admin
from django.urls import path, re_path, include
from . import views

urlpatterns = [
        path('users/preferences', views.preferences),
        path('users/registration', views.registration),
        path('users', views.handle_routeinpput_data),

    # path('', include('users.urls')),

    # re_path(r'^users/$', views.user_view),
    # re_path(r'^api/users/(?P<pk>[0-9]+)$', views.user_view),
    # # path('users', views.handle_routeinpput_data),
    # re_path(r'^users/$', views.handle_routeinpput_data),
    # re_path(r'^api/users/(?P<pk>[0-9]+)$', views.handle_routeinpput_data),
]
