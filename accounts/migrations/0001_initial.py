# Generated by Django 3.0.8 on 2020-07-20 15:12

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


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
                ('banner_img', models.ImageField(blank=True, null=True, upload_to='')),
                ('follower', models.ManyToManyField(blank=True, null=True, related_name='following', to=settings.AUTH_USER_MODEL)),
                ('usr', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
