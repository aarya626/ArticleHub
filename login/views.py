import json
from django.http import JsonResponse
from django.db.models import Q
from django.urls import reverse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import make_password
from django.core.files.storage import default_storage
from .models import Users, Articles, Categories

# Create your views here.


def home(request):
    articles = Articles.objects.select_related(
        'Category', 'user')
    context = {
        'articles': articles
    }
    return render(request, 'login/home.html', context)


def login_view(request):
    if request.method == 'POST':
        username = request.POST['Uname']
        password = request.POST['Pname']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Invalid username or password.')
            return redirect('login')

    return render(request, "login/logIn.html")


def signup_view(request):
    if request.method == "POST":
        first_name = request.POST["Fname"]
        last_name = request.POST["Lname"]
        username = request.POST["Uname"]
        email = request.POST["Ename"]
        password = request.POST["Pname"]
        password = make_password(password)
        user = Users.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            username=username,
            password=password,
        )

        login(request, user)
        return redirect('home')
    return render(request, "login/signup.html")


def profile_view(request, username):
    user = Users.objects.get(username=username)
    print(user)
    if not user.bio:
        user.bio = ""
    if not user.profile:
        user.profile = "/static/images/profile_pics/defaultpfpsvg.png"
    context = {
        'user': user
    }
    return render(request, "login/Profile.html", context)

def article_page(request, article_id):
    user = request.user
    article = Articles.objects.select_related('user').get(article_id=article_id)
    author = article.user.first_name + ' ' + article.user.last_name
    profile = article.user.profile if article.user.profile else "/static/images/profile_pics/defaultpfpsvg.png"
    likes = article.likes.count()
    dislikes = article.dislikes.count()
    context = {
        'article': article,
        'author': author,
        'profile': profile,
        'likes': likes,
        'dislikes':dislikes
    }
    if request.method == 'POST':

        action = request.headers.get('X-action')

        # Check if the action is valid (like or dislike)
        if action == 'like':
            if article.likes.filter(pk=user.pk).exists():
                article.likes.remove(user)
            elif not article.likes.filter(pk=user.pk).exists():
                # If the user has already disliked the article, remove the dislike
                if article.dislikes.filter(pk=user.pk).exists():
                    article.dislikes.remove(user)
                article.likes.add(user)
        elif action == 'dislike':
            if article.dislikes.filter(pk=user.pk).exists():
                article.dislikes.remove(user)
            elif not article.dislikes.filter(pk=user.pk).exists():
                # If the user has already liked the article, remove the like
                if article.likes.filter(pk=user.pk).exists():
                    article.likes.remove(user)
                article.dislikes.add(user)

        return JsonResponse({'likes_count': article.likes.count(),'dislikes_count': article.dislikes.count()})
        
    return render(request, "login/articlepage.html", context)


def article_publish(request):
    if request.method == 'POST':
        user = request.user
        image = request.FILES['image']
        thumbnail = default_storage.save(
            'static/images/article_pics/' + image.name, image)
        title = request.POST.get('heading')
        category = request.POST.get('category')
        content = request.POST.get('content')
        category_obj = Categories.objects.get(category=category)
        thumbnail = '/'+thumbnail
        article = Articles.objects.create(
            title=title,
            content=content,
            thumbnail=thumbnail,
            Category_id=category_obj.category_id,
            user_id=user.user_id
        )
        return JsonResponse({'id': article.article_id})

    return render(request, "login/articlewriting.html")
