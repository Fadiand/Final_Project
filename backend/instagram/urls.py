from django.urls import path
from . import views
from .views import hashtag_search

urlpatterns = [
    path('public-images/', hashtag_search, name='hashtag_search'),

]
