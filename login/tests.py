from django.test import TestCase, Client
from django.urls import reverse

from .models import Articles, Categories, UserProfile, Users

class HomeViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = Users.objects.create_user(username='testuser', password='testpassword')
        self.category = Categories.objects.create(name='Test Category')
        self.article = Articles.objects.create(
            title='Test Article',
            content='This is a test article content.',
            user=self.user,
            category=self.category
        )
        self.url = reverse('home')

    def test_home_view(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'login/home.html')
        # Add more assertions to verify the content of the response if needed

    def test_post_bookmark_action(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.post(self.url, {'articleId': self.article.id})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue('bookmarked' in data)
        self.assertTrue(data['bookmarked'])
        # Add more assertions to verify the bookmarking functionality

    def test_post_logout_action(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.post(self.url, HTTP_X_ACTION='logout')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue('success' in data)
        self.assertEqual(data['success'], 'success')
        # Add more assertions to verify the logout functionality


class LoginViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('login')

    def test_get_login_page(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'login/logIn.html')

    def test_successful_login(self):
        user = Users.objects.create_user(username='testuser', password='testpassword')
        response = self.client.post(self.url, {'Uname': 'testuser', 'Pname': 'testpassword'})
        self.assertRedirects(response, reverse('home'))

    def test_failed_login(self):
        response = self.client.post(self.url, {'Uname': 'invaliduser', 'Pname': 'invalidpassword'})
        self.assertRedirects(response, reverse('login'))
        self.assertContains(response, 'Invalid username or password.')


class SignupViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('signup')

    def test_get_signup_page(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'login/signup.html')

    def test_successful_signup(self):
        data = {
            'first': 'John',
            'last': 'Doe',
            'username': 'johndoe',
            'email': 'johndoe@example.com',
            'password': 'testpassword',
            'bio': 'Test bio',
            'ispublisher': True
        }
        response = self.client.post(self.url, data, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Users.objects.filter(username='johndoe').exists())

    def test_unsuccessful_signup_missing_fields(self):
        data = {
            'first': 'John',
            'last': 'Doe',
            'username': 'johndoe',
            'password': 'testpassword',
            'bio': 'Test bio',
            'ispublisher': True
        }
        response = self.client.post(self.url, data, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'This field is required.')

    def test_unsuccessful_signup_existing_username(self):
        Users.objects.create_user(username='existinguser', password='testpassword')
        data = {
            'first': 'John',
            'last': 'Doe',
            'username': 'existinguser',
            'password': 'testpassword',
            'bio': 'Test bio',
            'ispublisher': True
        }
        response = self.client.post(self.url, data, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'A user with that username already exists.')


class ProfileViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = Users.objects.create_user(username='testuser', password='testpassword')
        self.profile_user = Users.objects.create(username='profileuser', email='profileuser@example.com')
        self.url = reverse('profile', kwargs={'username': 'profileuser'})

    def test_get_profile_page(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'login/Profile.html')

    def test_post_delete_article(self):
        self.client.login(username='testuser', password='testpassword')
        article = Articles.objects.create(title='Test Article', content='Test content', user=self.profile_user)
        response = self.client.post(self.url, {'X-action': 'deletearticle', 'articleId': article.id})
        self.assertEqual(response.status_code, 200)
        self.assertFalse(Articles.objects.filter(id=article.id).exists())


class ArticlePageViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = Users.objects.create_user(username='testuser', password='testpassword')
        self.article = Articles.objects.create(title='Test Article', content='Test content', user=self.user)
        self.url = reverse('article_page', kwargs={'article_id': self.article.article_id})

    def test_get_article_page(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'login/articlepage.html')

    def test_post_like_action(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.post(self.url, HTTP_X_ACTION='like')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['likes_count'], 1)

    def test_post_dislike_action(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.post(self.url, HTTP_X_ACTION='dislike')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['dislikes_count'], 1)

    def test_post_comment_action(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.post(self.url, {'X-action': 'comment', 'comment': 'Test comment'})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue('username' in data)
        self.assertTrue('timesince' in data)
        self.assertTrue('profile' in data)



class ArticlePublishViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = Users.objects.create_user(username='testuser', password='testpassword')
        self.category = Categories.objects.create(category='Test Category')
        self.url = reverse('article_publish')

    def test_get_article_publish_page(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'login/articlewriting.html')

    def test_post_publish_article(self):
        self.client.login(username='testuser', password='testpassword')
        with open('static/images/your/article_pics/image.jpg', 'rb') as file:
            response = self.client.post(self.url, {'image': file, 'heading': 'Test Article', 'category': 'Test Category', 'content': 'Test content'})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue('id' in data)
        self.assertTrue(Articles.objects.filter(article_id=data['id']).exists())


class DeleteAccountViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = Users.objects.create_user(username='testuser', password='testpassword')
        self.url = reverse('delete_account')

    def test_get_delete_account_page(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'login/deleteaccount.html')

    def test_post_delete_account_success(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.post(self.url, {'password': 'testpassword'})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue('success' in data)
        self.assertTrue(data['success'])
        self.assertFalse(Users.objects.filter(username='testuser').exists())

    def test_post_delete_account_incorrect_password(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.post(self.url, {'password': 'incorrectpassword'})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue('error' in data)
        self.assertEqual(data['error'], 'Incorrect password')
        self.assertTrue(Users.objects.filter(username='testuser').exists())


class ChangePasswordViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = Users.objects.create_user(username='testuser', password='testpassword')
        self.url = reverse('change_password')

    def test_get_change_password_page(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'login/changeyourpassword.html')

    def test_post_change_password_success(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.post(self.url, {'oldpassword': 'testpassword', 'password': 'newtestpassword'})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue('success' in data)
        self.assertEqual(data['success'], 'Password changed successfully')

        # Check if the password has actually changed in the database
        user = Users.objects.get(username='testuser')
        self.assertTrue(user.check_password('newtestpassword'))

    def test_post_change_password_incorrect_old_password(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.post(self.url, {'oldpassword': 'incorrectpassword', 'password': 'newtestpassword'})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue('Error' in data)
        self.assertEqual(data['Error'], 'error')

        # Check if the password remains unchanged in the database
        user = Users.objects.get(username='testuser')
        self.assertTrue(user.check_password('testpassword'))


class CategoriesShowViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = Users.objects.create_user(username='testuser', password='testpassword')
        self.category = Categories.objects.create(category='Test Category')
        self.article1 = Articles.objects.create(title='Article 1', content='Content 1', user=self.user, Category=self.category)
        self.article2 = Articles.objects.create(title='Article 2', content='Content 2', user=self.user, Category=self.category)
        self.url_all = reverse('categories_show', kwargs={'category': 'all'})
        self.url_following = reverse('categories_show', kwargs={'category': 'following'})
        self.url_specific = reverse('categories_show', kwargs={'category': 'Test Category'})

    def test_get_categories_show_all(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.get(self.url_all)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'login/articleCategoriesPage.html')
        self.assertTrue('articles' in response.context)
        self.assertEqual(len(response.context['articles']), 2)  # Check if all articles are fetched

    def test_get_categories_show_following(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.get(self.url_following)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'login/articleCategoriesPage.html')
        self.assertTrue('following_articles' in response.context)
        self.assertEqual(len(response.context['following_articles']), 0)  # Assuming no followed users, so no articles

    def test_get_categories_show_specific(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.get(self.url_specific)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'login/articleCategoriesPage.html')
        self.assertTrue('articles' in response.context)
        self.assertEqual(len(response.context['articles']), 2) 


class SearchResultViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user1 = Users.objects.create_user(username='testuser1', password='testpassword')
        self.user2 = Users.objects.create_user(username='testuser2', password='testpassword')
        self.article1 = Articles.objects.create(title='Test Article 1', content='Content 1', user=self.user1)
        self.article2 = Articles.objects.create(title='Test Article 2', content='Content 2', user=self.user2)
        self.url = reverse('search_result')

    def test_get_search_result_page(self):
        response = self.client.get(self.url, {'search': 'Test'})
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'login/searchpage.html')
        self.assertTrue('articles' in response.context)
        self.assertTrue('authors_articles' in response.context)

    def test_search_articles(self):
        response = self.client.get(self.url, {'search': 'Article'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.context['articles']), 2)  # Both articles should match the search query

    def test_search_users(self):
        response = self.client.get(self.url, {'search': 'user1'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.context['authors_articles']), 1)
