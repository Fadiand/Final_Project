from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.utils.timezone import now


class User(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(default=now)  
    Is_active = models.BooleanField(default=True)
    Is_superviser = models.BooleanField(default=False)


    # פה אנחנו בודקים אם הסיסמא שהבן אדם רשם האם היא זהה למה שיש במאגר נתונים שלנו
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    # פה אנחנו מצפינים את הסיסמא שלנו בשביל שזה יהיה יותר מאובטח כמובן
    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        self.save()
        
    def _str_(self):
        return f"Username: {self.username}, Email: {self.email}"