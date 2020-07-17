from .models import Tweet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers


class ActionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    action = serializers.CharField()
    content = serializers.CharField(allow_blank=True, required=False)


class TweetSerializer(ModelSerializer):
    likes = serializers.SerializerMethodField('liked_by')
    owner_name = serializers.SerializerMethodField('get_owner_name')
    parent_serialized = serializers.SerializerMethodField('get_parent')

    class Meta:
        model = Tweet
        fields = ['id', 'likes', 'content', 'parent_serialized', 'owner_name', 'img']

    def liked_by(self, obj: Tweet):
        likes = obj.like_set.all()
        likes_id = list(map(lambda x: x.user_id, likes))
        return likes_id

    def get_owner_name(self, obj: Tweet):
        if obj.owner:
            return obj.owner.username
        return 'User Deeleted'


    def get_parent(self, obj:Tweet):
        if obj.is_retweet:
            serialized = TweetSerializer(obj.parent)
            return serialized.data
        return None