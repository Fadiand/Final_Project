from django.db import models
from signup_app.models import User  # ייבוא מודל המשתמש


class Image_user(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name="images")  
    image = models.ImageField(upload_to='images/')  # התמונות יישמרו בתיקיית media/images
    uploaded_at = models.DateTimeField(auto_now_add=True)  # חותמת זמן אוטומטית
    classification = models.CharField(max_length=20, choices=[("תיירות", "תיירות"), ("לא תיירות", "לא תיירות")], null=True)
    confidence = models.FloatField(null=True, blank=True)  # שמירת רמת הביטחון בסיווג
    feedback = models.CharField(
    max_length=10,
    choices=[("like", "Like"), ("dislike", "Dislike")],
    null=True,
    blank=True
)

    def __str__(self):
        return f"{self.user.username if self.user else 'Anonymous'} - {self.classification} - {self.image.name}"

    class Meta:
        verbose_name = "Image"
        verbose_name_plural = "Images"

