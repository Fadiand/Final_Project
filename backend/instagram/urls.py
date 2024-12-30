from django.urls import path
from . import views

urlpatterns = [
    path('callback/', views.instagram_callback, name='instagram_callback'),
]

