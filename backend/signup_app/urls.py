from django.urls import path

from .views import SignUpView , LoginView ,LogOut, UserInfo

urlpatterns = [
    path("api/signup/", SignUpView.as_view(), name="signup"),
    path("api/login/", LoginView.as_view(), name="login"),
    path("api/logout/",LogOut.as_view(), name="logout"),
    path('api/user-info/', UserInfo.as_view(), name='user-info'),

]
