# Generated by Django 4.2.6 on 2024-05-06 20:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0011_userprofile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='bio',
            field=models.TextField(default='', max_length=150),
        ),
    ]