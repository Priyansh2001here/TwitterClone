# Generated by Django 3.0.8 on 2020-07-21 06:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='banner_img',
            field=models.ImageField(blank=True, null=True, upload_to='accounts/banner_img'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='prof_img',
            field=models.ImageField(blank=True, null=True, upload_to='accounts/profile_img'),
        ),
    ]