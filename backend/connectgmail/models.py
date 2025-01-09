from django.db import models

class gmail_users(models.Model):
     email = models.CharField(max_length=100)
     name = models.CharField(max_length=100)
    
    
     def __str__(self):
        return f"User_Name : {self.name} ,  Email: {self.email}"  # הצג את השם והמייל יחד
    # last_email = None
    # last_name = None
    # Create your models here.
# Create your models here.
