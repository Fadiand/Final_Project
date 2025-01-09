from django.db import models

class Image(models.Model):
    image = models.ImageField(upload_to='images/')  # העלאה לתיקיית images/
    uploaded_at = models.DateTimeField(auto_now_add=True)  # חותמת זמן אוטומטית

    def __str__(self):
        return self.image.name