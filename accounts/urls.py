from django.urls import path

from . import views

app_name = 'accounts'
urlpatterns = [
    path('login', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('usrinfo', views.userinf),
    path('api/profile/<int:pk>', views.profile_view),
    path('login_api', views.login_api),
    path('usr_regis_api', views.user_regis_api),
    path('prof_update', views.prof_update_api),
    path('prof_update_show', views.prof_update, name='profile_update'),
]
