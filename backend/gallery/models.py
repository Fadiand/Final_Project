from django.db import models
from signup_app.models import User
class Image_user(models.Model):
    # שדה לאחסון הקובץ (תמונה)
    image = models.ImageField(upload_to='images/')  # התמונות יישמרו בתיקיית media/images
    # שדה לאחסון זמן ההעלאה
    uploaded_at = models.DateTimeField(auto_now_add=True)  # חותמת זמן אוטומטית
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='images', null=True,blank=True)
    def __str__(self):
        return f"Image: {self.image.name}" 
    
    class Meta:
        verbose_name = "Image"
        verbose_name_plural = "Images"
        
        
        
        
        
