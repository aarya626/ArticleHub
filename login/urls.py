from django.urls import path
from . import views

urlpatterns = [
    path('',views.home,name='home'),
    path("login/",views.login_view,name="login"),
    path("signup/",views.signup_view,name="signup"),
    path("profile/",views.profile_view,name="profile"),
    path("articlepage/<int:article_id>/",views.article_page,name="articlepage"),
    path("publish/",views.article_publish,name="publish"),
]
