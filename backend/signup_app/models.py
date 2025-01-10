from django.db import models

from django.db import models

class User(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)

    def __str__(self):
        return f"IserName : {self.username}, Email : {self.email}, Password : {self.password}"


# Create your models here.
