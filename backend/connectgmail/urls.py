from django.urls import path
from . import views

from .views import LogOut

urlpatterns = [
    path('api/auth/google/', views.google_auth, name='google-auth'),
    path('google/', views.google_auth, name='google-auth'),  # הוספת הנתיב ל-View של Google

]
