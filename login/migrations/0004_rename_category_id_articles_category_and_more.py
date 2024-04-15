# Generated by Django 4.2.6 on 2024-04-15 15:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0003_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='articles',
            old_name='Category_id',
            new_name='Category',
        ),
        migrations.RenameField(
            model_name='comments',
            old_name='article_id',
            new_name='article',
        ),
        migrations.RenameField(
            model_name='comments',
            old_name='user_id',
            new_name='user',
        ),
        migrations.RenameField(
            model_name='likes',
            old_name='article_id',
            new_name='article',
        ),
        migrations.RenameField(
            model_name='likes',
            old_name='user_id',
            new_name='user',
        ),
        migrations.AlterField(
            model_name='articles',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='comments',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='likes',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='users',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
