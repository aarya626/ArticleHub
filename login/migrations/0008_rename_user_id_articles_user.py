# Generated by Django 4.2.6 on 2024-04-15 19:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0007_alter_articles_other_pics_alter_users_bio_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='articles',
            old_name='user_id',
            new_name='user',
        ),
    ]
