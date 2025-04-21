# signup_app/models.py

from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.utils.timezone import now

class User(models.Model):
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128, blank=True)  # לגוגל ופייסבוק לא חייב סיסמה
    last_login = models.DateTimeField(default=now)
    Is_active = models.BooleanField(default=True)
    Is_superviser = models.BooleanField(default=False)
    first_login = models.BooleanField(default=True)

    AUTH_PROVIDERS = [
        ('local', 'Local'),
        ('google', 'Google'),
        ('facebook', 'Facebook'),
    ]
    auth_provider = models.CharField(max_length=20, choices=AUTH_PROVIDERS, default='local')

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        self.save()
        
    def __str__(self):
        return f"{self.username or self.email} ({self.auth_provider})"
