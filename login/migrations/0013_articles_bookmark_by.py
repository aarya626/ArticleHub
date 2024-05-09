# Generated by Django 4.2.6 on 2024-05-09 18:20

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0012_alter_users_bio'),
    ]

    operations = [
        migrations.AddField(
            model_name='articles',
            name='bookmark_by',
            field=models.ManyToManyField(related_name='bookmarked_articles', to=settings.AUTH_USER_MODEL),
        ),
    ]
