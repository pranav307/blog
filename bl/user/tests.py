from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import Customuser,Comment


# class Profiletestclient(APITestCase):

#     def setUp(self):
#         self.client = APIClient()

#     def test_profile_create(self):
#         url = reverse("reg")

#         data = {
#             "username": "testuser",
#             "email": "test@gmail.com",
#             "password": "12345678"
#         }

#         response = self.client.post(url, data, format="json")

#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

class Commenttestclient(APITestCase):
    def setUp(self):
       self.client =APIClient()
       self.user=Customuser.objects.create(
           email="q@g.com",
           username="ll",
           password="000000pp"
       )
       # login
       self.client.force_authenticate(user=self.user)

    def test_comment_create(self):
        # basename-action
        url =reverse("commentview-ccom") + "?post_id=1"
        data={
            "content":"ho gaya bhe" 
        }

        response =self.client.post(url,data,format="json")

        self.assertEqual(response.status_code,status.HTTP_201_CREATED)