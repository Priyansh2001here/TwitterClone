from django.urls import path
from . import views

app_name = "tweets"
urlpatterns = [
    path('', views.home, name='home'),
    path('create', views.create, name='create'),
    path('api/<int:tweet_id>/<str:action>', views.action_serialize, name='like'),
    path('tweets_api', views.tweet_serialize),
    path('tweets/<int:tweet_id>/retweet', views.retweet, name='retweet'),
]