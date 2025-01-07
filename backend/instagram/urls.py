from django.urls import path
from . import views
from .views import webhook
from .views import google_auth

urlpatterns = [
    path('callback/', views.instagram_callback, name='instagram_callback'),
    path('', webhook, name='webhook'),
    path('api/auth/google/', google_auth, name='google-auth'),
    path('google/', google_auth, name='google-auth'),  # הוספת הנתיב ל-View של Google

]