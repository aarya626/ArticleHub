from django.shortcuts import render, redirect
from django.db import connection
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import make_password, check_password
from .models import Users

# Create your views here.


def home(request):
    return render(request, 'login/home.html')


def login_view(request):
    if request.method == 'POST':
        username = request.POST['Uname']
        password = request.POST['Pname']
        # password = make_password(password)
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Invalid username or password.')
            return redirect('login')

    return render(request, "login/logIn.html")


def signup(request):
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
