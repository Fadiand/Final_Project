from django.urls import path
from .views import facebook_auth

urlpatterns = [
    path('facebook-auth/', facebook_auth, name='facebook_auth'),  # פוסט מהפרונט עם הטוקן
]
