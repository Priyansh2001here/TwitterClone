from django.urls import path
from . import views


urlpatterns = [
    path('', views.index),
    path('message', views.chat_save)
]