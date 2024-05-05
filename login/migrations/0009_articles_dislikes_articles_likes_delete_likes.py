# Generated by Django 4.2.6 on 2024-05-04 18:38

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0008_rename_user_id_articles_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='articles',
            name='dislikes',
            field=models.ManyToManyField(related_name='dislikes', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='articles',
            name='likes',
            field=models.ManyToManyField(related_name='likes', to=settings.AUTH_USER_MODEL),
        ),
        migrations.DeleteModel(
            name='Likes',
        ),
    ]