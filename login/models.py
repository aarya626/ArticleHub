from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.


class Users(AbstractUser):
    user_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50, null=False)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=100, unique=True)
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=100)
    profile = models.CharField(max_length=200,null=True)
    bio = models.TextField(max_length=150,null=True)
    is_publisher = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        db_table = 'Users'


class Categories(models.Model):
    category_id = models.AutoField(primary_key=True)
    category = models.CharField(max_length=20, null=False)

    class Meta:
        db_table = 'Categories'


class Articles(models.Model):
    article_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100, null=False)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    Category = models.ForeignKey(Categories, on_delete=models.CASCADE)
    content = models.TextField()
    thumbnail = models.CharField(max_length=1000, null=False)
    other_pics = models.CharField(max_length=2000, null=True)
    likescount = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Articles'


class Likes(models.Model):
    like_id = models.AutoField(primary_key=True)
    article = models.ForeignKey(Articles, on_delete=models.CASCADE)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Likes'


class Comments(models.Model):
    comment_id = models.AutoField(primary_key=True)
    article = models.ForeignKey(Articles, on_delete=models.CASCADE)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Comments'
