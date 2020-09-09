from django.conf.urls import url
from django.urls import path
from rest_framework_jwt.views import obtain_jwt_token

from . import views

app_name = 'accounts'
urlpatterns = [
    path('logout/', views.logout, name='logout'),
    path('api/userinfo', views.userinfo),
    path('api/profile/<int:pk>', views.usr_profile_view),
    path('api/profile', views.self_profile),
    path('api/login', views.login_api),
    path('api/register', views.user_regis_api),
    path('prof_update', views.prof_update_api),
    path('prof_update_show', views.prof_update, name='profile_update'),
    path('profile', views.profile_page),
    path('api/search/<str:term>', views.search),
    path('profile/<int:pk>', views.profile_view),
    path('api/profile/action', views.profile_action),

    url(r'^get-token', obtain_jwt_token),
]
