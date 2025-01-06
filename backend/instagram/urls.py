from django.urls import path
from . import views
from .views import webhook


urlpatterns = [
    path('callback/', views.instagram_callback, name='instagram_callback'),
    path('', webhook, name='webhook'),

]

