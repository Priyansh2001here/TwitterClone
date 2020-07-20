from django.urls import path
from . import views


app_name= 'accounts'
urlpatterns = [
    path('login', views.login, name='login'),
    path('register', views.register, name='register'),
    path('logout/', views.logout, name='logout'),
    path('usrinfo', views.userinf),
    path('api/profile/<int:pk>', views.profile_view),
    path('login_api', views.login_api)
]