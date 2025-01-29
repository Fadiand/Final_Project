from django.db import models
from signup_app.models import User  # ייבוא מודל המשתמש


class Image_user(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null = True)  # קישור משתמש לכל תמונה
    # שדה לאחסון הקובץ (תמונה)
    image = models.ImageField(upload_to='images/')  # התמונות יישמרו בתיקיית media/images
    # שדה לאחסון זמן ההעלאה
    uploaded_at = models.DateTimeField(auto_now_add=True)  # חותמת זמן אוטומטית

    def _str_(self):
        return self.image.name  # הצגת שם הקובץ

    class Meta:
        verbose_name = "Image"
        verbose_name_plural = "Images"
