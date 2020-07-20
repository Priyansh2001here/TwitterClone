from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save


# Create your models here.
def auto_prof_create(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(usr=instance)


class Profile(models.Model):
    usr = models.OneToOneField(User, on_delete=models.SET_NULL, null=True)
    bio = models.TextField(null=True, blank=True)
    prof_img = models.ImageField(blank=True, null=True)
    follower = models.ManyToManyField(User, blank=True, null=True, related_name='following')

    def __str__(self):
        return self.usr.username


post_save.connect(auto_prof_create, sender=User)

'''
<django.db.models.fields.related_descriptors.create_forward_many_to_many_manager.<locals>.ManyRelatedManager object at 0x0000018B69855908>
Profile.objects.first().follower.all()
<QuerySet []>
Profile.objects.first().following.all()
Traceback (most recent call last):
  File "<input>", line 1, in <module>
AttributeError: 'Profile' object has no attribute 'following'
u1.following.all()
<QuerySet []>
    
    '''
