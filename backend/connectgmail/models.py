from django.db import models

class gmail_users(models.Model):
     email = models.CharField(max_length=100)
     name = models.CharField(max_length=100)
     Is_active = models.BooleanField(default=True)
     Is_superviser = models.BooleanField(default=False)
    
     @property
     def is_authenticated(self):
        return self.Is_active  # משתמש במצב הפעילות של המשתמש
    
     def _str_(self):
        return f"User_Name : {self.name} ,  Email: {self.email} , Is_active : {self.Is_active}, Is_superviser : {self.Is_superviser} "

