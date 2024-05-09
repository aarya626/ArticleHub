import json
from django.http import JsonResponse
from django.db.models import Count
from django.urls import reverse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import make_password
from django.core.files.storage import default_storage
from .models import Users, Articles, Categories, Comments, UserProfile
from .templatetags.login_extras import simplify_timesince
from django.utils.datastructures import MultiValueDictKeyError
from django.contrib.auth.decorators import login_required

# Create your views here.


def home(request):
    articles = Articles.objects.select_related(
        'Category', 'user').annotate(num_likes=Count('likes')).order_by('-num_likes')[:10]
    for article in articles:
        article.bookmarked = article.bookmark_by.filter(pk=request.user.pk).exists()
    categories = Categories.objects.all()
    context = {
        'articles': articles,
        'categories': categories,
        # 'likes': articles.num_likes,
        # 'dislikes': article.dislikes.count(),
    }
    if request.method == 'POST':
        user = request.user
        article_id = request.POST.get('articleId')
        article = Articles.objects.get(article_id=article_id)
        # print(article.title)
        if user in article.bookmark_by.all():
            article.bookmark_by.remove(user)
            bookmarked = False
        else:
            article.bookmark_by.add(user)
            bookmarked = True
        return JsonResponse({'bookmarked': bookmarked})

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
        first_name = request.POST.get('first')
        last_name = request.POST.get('last')
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        try:
            image = request.FILES['profilepic']
            profile = default_storage.save(
                'static/images/profile_pics/' + image.name, image)
            profile = '/' + profile
        except MultiValueDictKeyError:
            profile = '/static/images/profile_pics/defaultpfpsvg.png'
        bio = request.POST.get('bio')
        isPublisher = request.POST.get('ispublisher')
        # print(first_name,last_name,username,email,password,bio,isPublisher,profile)
        password = make_password(password)
        user = Users.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            username=username,
            password=password,
            profile=profile,
            is_publisher=isPublisher,
            bio=bio
        )
        login(request, user)
        return JsonResponse({})
    return render(request, "login/signup.html")


def profile_view(request, username):
    user = request.user
    profile_user = Users.objects.get(username=username)
    profile_followers, _ = UserProfile.objects.get_or_create(user=profile_user)
    isfollowing = profile_followers.followers.filter(pk=user.user_id).exists()
    bookmarked_articles = Articles.objects.filter(bookmark_by=profile_user.user_id)
    published_articles = Articles.objects.filter(user_id=profile_user.user_id)
    # for article in bookmarked_articles:
        # print(article.title)
    context = {
        'profile_user': profile_user,
        'user': user,
        'followers': profile_followers.followers.count(),
        'following': profile_followers.user.following.count(),
        'isfollowing': isfollowing,
        'bookmarked_articles': bookmarked_articles,
        'published_articles':published_articles
    }
    if request.method == 'POST':
        if profile_followers.followers.filter(pk=user.user_id).exists():
            profile_followers.followers.remove(user)
            isFollowing = False
        else:
            profile_followers.followers.add(user)
            isFollowing = True

        return JsonResponse({'isFollowing': isFollowing, 'followers': profile_followers.followers.count(), 'following': profile_followers.user.following.count(), })
    return render(request, "login/Profile.html", context)


def article_page(request, article_id):
    user = request.user
    article = Articles.objects.select_related(
        'user').get(article_id=article_id)
    author = article.user.first_name + ' ' + article.user.last_name
    profile = article.user.profile
    comments = Comments.objects.select_related('user').filter(
        article_id=article_id).all().order_by('-created_at')
    context = {
        'article': article,
        'author': author,
        'profile': profile,
        'likes': article.likes.count(),
        'dislikes': article.dislikes.count(),
        'comments': comments
    }
    if request.method == 'POST':

        action = request.headers.get('X-action')

        if action == 'like':
            if article.likes.filter(pk=user.pk).exists():
                article.likes.remove(user)
            elif not article.likes.filter(pk=user.pk).exists():
                if article.dislikes.filter(pk=user.pk).exists():
                    article.dislikes.remove(user)
                article.likes.add(user)
        elif action == 'dislike':
            if article.dislikes.filter(pk=user.pk).exists():
                article.dislikes.remove(user)
            elif not article.dislikes.filter(pk=user.pk).exists():
                if article.likes.filter(pk=user.pk).exists():
                    article.likes.remove(user)
                article.dislikes.add(user)
        elif action == 'comment':
            content = request.POST.get('comment')
            comment = Comments.objects.create(
                article_id=article_id,
                user_id=user.user_id,
                comment=content
            )
            commentuser = Users.objects.get(user_id=comment.user_id)
            value = simplify_timesince(comment.created_at)
            if value == '0 seconds ago':
                value = 'Just now'
            return JsonResponse({'username': commentuser.username, 'timesince': value, 'profile': commentuser.profile})

        return JsonResponse({'likes_count': article.likes.count(), 'dislikes_count': article.dislikes.count()})

    return render(request, "login/articlepage.html", context)


@login_required
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
