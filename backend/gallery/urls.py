from django.urls import path
from .views import upload_images, get_images, classify_image, delete_image , submit_feedback 



urlpatterns = [
    path('upload-images/', upload_images, name='upload_images'),
    path('get-images/', get_images, name='get_images'),
    path("classify-image/", classify_image, name="classify_image"),
    path('delete-image/<int:image_id>/', delete_image, name='delete_image'),
    path("submit-feedback/", submit_feedback, name='submit_feedback'),


]
