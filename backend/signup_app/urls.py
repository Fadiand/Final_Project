from django.urls import path

from .views import SignUpView , LoginView ,LogOut

urlpatterns = [
    path("api/signup/", SignUpView.as_view(), name="signup"),
    path("api/login/", LoginView.as_view(), name="login"),

    path("api/logout/",LogOut.as_view(), name="logout")
]
