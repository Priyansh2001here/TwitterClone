from django.urls import path
from . import views

app_name = "tweets"
urlpatterns = [
    path('', views.home, name='home'),
    # path('create', views.create, name='create'),
    path('api/action', views.action_serialize, name='like'),
    path('api/tweets', views.tweet_serialize),
    path('tweets/<int:tweet_id>/retweet', views.retweet, name='retweet'),
    path('api/tweets/global', views.tweet_serialize_global),
    path('api/create', views.tweet_create_api, name='tweet_create_api')
]
