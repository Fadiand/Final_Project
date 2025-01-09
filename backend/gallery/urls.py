from django.urls import path
from .views import upload_images, get_images
from . import views


urlpatterns = [
   path('upload/', upload_images, name='upload-images'),
    path('list/', get_images, name='list-images'),
    path('upload-images/', views.upload_images, name='upload_images'),
    path('get-images/', views.get_images, name='get_images'),
    
]

