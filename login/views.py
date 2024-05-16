import json
from django.http import JsonResponse
from django.db.models import Count, Q
from django.urls import reverse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django.core.files.storage import default_storage
from .models import Users, Articles, Categories, Comments, UserProfile, SocialMedia
from .templatetags.login_extras import simplify_timesince
from django.utils.datastructures import MultiValueDictKeyError
from django.contrib.auth.decorators import login_required

# Create your views here.


def home(request):
    articles = Articles.objects.select_related(
        'Category', 'user').annotate(num_likes=Count('likes')).order_by('-num_likes')[:10]
    categories_articles = Articles.objects.select_related(
        'Category', 'user').annotate(num_likes=Count('likes')).order_by('-created_at')
    for article in articles:
        article.bookmarked = article.bookmark_by.filter(
            pk=request.user.pk).exists()
    for article in categories_articles:
        article.bookmarked = article.bookmark_by.filter(
            pk=request.user.pk).exists()
    categories = Categories.objects.all()
    user = request.user
    context = {
        'articles': articles,
        'categories': categories,
        'categories_articles': categories_articles
    }
    if user.is_authenticated:
        user_profile, _ = UserProfile.objects.get_or_create(user=user)
        followed_users_profiles = user_profile.user.following.all()
        followed_users = [profile.user for profile in followed_users_profiles]
        following_articles = Articles.objects.filter(
            user__in=followed_users).annotate(num_likes=Count('likes')).order_by('-created_at')
        context['following_articles'] = following_articles
    if request.method == 'POST':
        if request.headers.get('X-action') == 'logout':
            logout(request)
            return JsonResponse({'success': 'success'})
        else:
            user = request.user
            article_id = request.POST.get('articleId')
            article = Articles.objects.get(article_id=article_id)
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
    bookmarked_articles = Articles.objects.filter(
        bookmark_by=profile_user.user_id).annotate(num_likes=Count('likes'))
    for article in bookmarked_articles:
        article.bookmarked = article.bookmark_by.filter(
            pk=request.user.pk).exists()
    published_articles = Articles.objects.filter(
        user_id=profile_user.user_id).annotate(num_likes=Count('likes'))
    social_user, _ = SocialMedia.objects.get_or_create(
        user_id=profile_user.user_id)
    print(user.user_id)
    context = {
        'profile_user': profile_user,
        'user': user,
        'followers': profile_followers.followers.count(),
        'following': profile_followers.user.following.count(),
        'isfollowing': isfollowing,
        'bookmarked_articles': bookmarked_articles,
        'published_articles': published_articles,
        'social_user': social_user
    }
    if request.method == 'POST':
        action = request.headers.get('X-action')
        # print(action)
        if action == 'deletearticle':
            article_id = request.POST.get('articleId')
            # print(article_id)
            article = Articles.objects.get(article_id=article_id)
            # print(article)
            article.delete()
            return JsonResponse({'success': 'success'})
        elif action == 'updatepfp':
            image = request.FILES['pfp']
            profile = default_storage.save(
                'static/images/profile_pics/' + image.name, image)
            profile = '/' + profile
            # print(profile)
            userpfp = Users.objects.get(username=request.user)
            userpfp.profile = profile
            userpfp.save()
            return JsonResponse({'success': 'success'})
        elif action == 'updateprofile':
            # print('bsbjfbsfhbbfebdkj')
            data = json.loads(request.body)

            user = Users.objects.get(username=request.user)
            if 'firstname' in data:
                user.firstname = data['firstname']
            if 'lastname' in data:
                user.lastname = data['lastname']
            if 'bio' in data:
                user.bio = data['bio']
            if 'username' in data:
                user.username = data['username']
            if 'email' in data:
                user.email = data['email']

            user.save()

            return JsonResponse({'message': 'User details updated successfully'})
        elif action == 'addlinks':
            link = request.POST.get('link')
            name = request.POST.get('socialmedia_name')
            user, _ = SocialMedia.objects.get_or_create(user=request.user)
            if name == 'fb':
                user.facebook = link
            if name == 'instasocial':
                user.instagram = link
            if name == 'twittersocial':
                user.twitter = link
            if name == 'mail':
                user.email = link
            user.save()
            return JsonResponse({'success': 'success'})
        elif action == 'follow':
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


def aboutus(request):
    return render(request, 'login/about.html')


def privacy(request):
    return render(request, 'login/privacy.html')


def delete_account(request):
    if request.method == 'POST':
        password = request.POST.get('password')
        # Authenticate the user with the provided password
        user = authenticate(
            request, username=request.user.username, password=password)
        if user:
            # Delete the user account
            user.delete()

            # Logout the user
            logout(request)

            return JsonResponse({'success': True})
        else:
            return JsonResponse({'error': 'Incorrect password'})
    return render(request, 'login/deleteaccount.html')


def change_password(request):
    if request.method == 'POST':
        password = request.POST.get('oldpassword')
        newpassword = request.POST.get('password')
        user = authenticate(
            request, username=request.user.username, password=password)
        user_db = Users.objects.get(username=request.user)
        if user:
            newpassword = make_password(newpassword)
            user_db.password = newpassword
            user_db.save()
            login(request, user_db)
            return JsonResponse({'success': 'Password changed successfully'})
        else:
            return JsonResponse({'Error': 'error'})

    return render(request, 'login/changeyourpassword.html')


def categories_show(request, category):
    if category == 'following':
        user_profile, _ = UserProfile.objects.get_or_create(user=request.user)
        followed_users_profiles = user_profile.user.following.all()
        followed_users = [profile.user for profile in followed_users_profiles]
        following_articles = Articles.objects.filter(
            user__in=followed_users).annotate(num_likes=Count('likes'))
        context = {
            'following_articles': following_articles,
            'category': category
        }
        return render(request, "login/articleCategoriesPage.html", context)
    elif category == 'all':
        articles = Articles.objects.select_related(
            'Category', 'user').all().annotate(num_likes=Count('likes')).order_by('-created_at')
        for article in articles:
            article.bookmarked = article.bookmark_by.filter(
                pk=request.user.pk).exists()
        context = {
            'articles': articles,
            'name': 'All'
        }
        return render(request, "login/articleCategoriesPage.html", context)
    else:
        category_id = Categories.objects.get(category=category).category_id
        articles = Articles.objects.select_related(
            'Category', 'user').filter(Category=category_id).all().annotate(num_likes=Count('likes')).order_by('-created_at')
        for article in articles:
            article.bookmarked = article.bookmark_by.filter(
                pk=request.user.pk).exists()
        context = {
            'articles': articles,
            'name': category
        }
        return render(request, "login/articleCategoriesPage.html", context)


def search_result(request):
    search_query = request.GET.get('search')
    print(search_query)
    articles = Articles.objects.select_related(
        'Category', 'user').filter(title__icontains=search_query).all().annotate(num_likes=Count('likes')).order_by('-created_at')
    users = Users.objects.filter(username__icontains=search_query)
    user = [author.user_id for author in users]
    print(user)
    authors_articles = Articles.objects.select_related('user').filter(user__in=user).all().annotate(num_likes=Count('likes')).order_by('-created_at')
    print(authors_articles)
    context = {
        'articles': articles,
        'authors_articles': authors_articles,
        'search_query': search_query
    }
    return render(request, 'login/searchpage.html', context)


def forgot_password(request):
    if request.method == 'POST':
        user = request.POST.get('oldpassword')
        newpassword = request.POST.get('password')
        # print(user,password)
        user_db = Users.objects.get(username=user)
        if user_db:
            newpassword = make_password(newpassword)
            user_db.password = newpassword
            user_db.save()
            login(request, user_db)
            return JsonResponse({'success': 'Password changed successfully'})
        else:
            return JsonResponse({'Error': 'error'})

    return render(request, 'login/forgotpassword.html')