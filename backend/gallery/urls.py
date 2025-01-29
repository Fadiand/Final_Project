from django.urls import path
from .views import upload_images, get_images


urlpatterns = [
    path('upload-images/', upload_images, name='upload_images'),
    path('get-images/', get_images, name='get_images'),
]
