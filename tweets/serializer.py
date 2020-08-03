from .models import Tweet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

class RetweetSerializer(serializers.ModelSerializer):

    owner_name = serializers.SerializerMethodField('get_owner_name')


    class Meta:
        model = Tweet
        fields = [
            'id',
            'content',
            'owner_name',
            'img',
        ]

    def get_owner_name(self, obj : Tweet):
        if obj.owner:
            return obj.owner.username
        return 'User Deeleted'

class ActionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    action = serializers.CharField()
    content = serializers.CharField(allow_blank=True, required=False)


class TweetSerializer(ModelSerializer):
    likes_count = serializers.SerializerMethodField('liked_by')
    owner_name = serializers.SerializerMethodField('get_owner_name')
    parent_serialized = serializers.SerializerMethodField('get_parent')
    retweet_count = serializers.SerializerMethodField('get_retweet_count')
    is_liked = serializers.SerializerMethodField('get_is_liked')

    class Meta:
        model = Tweet
        fields = [
            'id',
            'likes_count',
            'is_liked',
            'content',
            'owner_name',
            'img',
            'retweet_count',
            'parent_serialized',
        ]

    def liked_by(self, obj: Tweet):
        return obj.like_set.all().count()
        # likes_id = list(map(lambda x: x.user_id, likes))
        # return likes_id

    def get_owner_name(self, obj: Tweet):
        if obj.owner:
            return obj.owner.username
        return 'User Deeleted'

    def get_parent(self, obj: Tweet):
        if obj.is_retweet:
            serialized = RetweetSerializer(obj.parent)
            return serialized.data
        return None

    def get_retweet_count(self, obj: Tweet):
        if not obj.is_retweet:
            return None
        else:
            return obj.retweets.count()

    def get_is_liked(self, obj: Tweet) -> bool:
        context = self.context
        request = context.get('request')
        if request.user.is_authenticated:
            like = obj.like_set.filter(user=request.user)
            if like:
                return True
            return False
        return False
