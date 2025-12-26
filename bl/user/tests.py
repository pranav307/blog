from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import Customuser


class Profiletestclient(APITestCase):

    def setUp(self):
        self.client = APIClient()

    def test_profile_create(self):
        url = reverse("reg")

        data = {
            "username": "testuser",
            "email": "test@gmail.com",
            "password": "12345678"
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
