from django.db import models
from accounts.models import Profile


class Thread(models.Model):
    sender = models.ForeignKey(Profile, related_name='sender', on_delete=models.SET_NULL, null=True)
    receiver = models.ForeignKey(Profile, related_name='receiver', on_delete=models.SET_NULL, null=True)


class Message(models.Model):
    content = models.CharField(max_length=500)
    thread = models.ForeignKey(Thread, on_delete=models.SET_NULL, null=True, related_name='related_thread')
