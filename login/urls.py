from django.urls import path
from . import views

urlpatterns = [
    path('',views.home,name='home'),
    path("login/",views.login_view,name="login"),
    path("signup/",views.signup_view,name="signup"),
    path("profile/<str:username>/",views.profile_view,name="profile"),
    path("articlepage/<int:article_id>/",views.article_page,name="articlepage"),
    path("publish/",views.article_publish,name="publish"),
    path("about/",views.aboutus,name="about"),
    path("privacy/",views.privacy,name="privacy"),
    path("deleteyouraccount/",views.delete_account,name="deleteaccount"),
    path("changeyourpassword/",views.change_password,name="changepassword"),
    path("articleCategoriesPage/<str:category>/",views.categories_show,name="categories_show"),
    path("search/",views.search_result,name="search_result"),
]
