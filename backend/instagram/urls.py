from django.urls import path
from . import views
from .views import fetch_public_instagram_images

urlpatterns = [
    path('public-images/', fetch_public_instagram_images, name='fetch_public_instagram_images'),
]
