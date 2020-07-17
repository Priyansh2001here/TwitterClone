# Generated by Django 3.0.8 on 2020-07-15 21:03

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bio', models.TextField(blank=True, null=True)),
                ('prof_img', models.ImageField(blank=True, null=True, upload_to='')),
                ('follower', models.ManyToManyField(blank=True, null=True, related_name='following', to=settings.AUTH_USER_MODEL)),
                ('usr', models.OneToOneField(on_delete=models.SET('user deleted'), to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
