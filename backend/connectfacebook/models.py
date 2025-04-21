# connectfacebook/models.py

from django.db import models

class facebook_users(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    picture = models.URLField(blank=True, null=True)
    Is_active = models.BooleanField(default=True)

    @property
    def is_authenticated(self):
        return self.Is_active

    def __str__(self):
        return f"Facebook User: {self.name}, Email: {self.email}, Active: {self.Is_active}"

