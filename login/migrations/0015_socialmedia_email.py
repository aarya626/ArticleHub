# Generated by Django 4.2.6 on 2024-05-14 20:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0014_socialmedia'),
    ]

    operations = [
        migrations.AddField(
            model_name='socialmedia',
            name='email',
            field=models.EmailField(max_length=100, null=True),
        ),
    ]
