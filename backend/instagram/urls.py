from django.urls import path
from . import views
from .views import hashtag_search,fetch_instagram_images,proxy_image

urlpatterns = [
    path('public-images/', hashtag_search, name='hashtag_search'),
    path("fetch_instagram_images/", fetch_instagram_images, name="fetch_instagram_images"),
    path("proxy/", proxy_image, name="proxy_image"), 


]
