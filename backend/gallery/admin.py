from django.contrib import admin

from .models import Image_user  # ייבוא המודל

@admin.register(Image_user)
class ImageUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'image', 'uploaded_at','user','classification','feedback')  # שדות שיוצגו ברשימה
    list_filter = ('uploaded_at','user','classification')  # אפשרות סינון לפי זמן העלאה
    search_fields = ('image',)  # שדה חיפוש לפי שם הקובץ
    ordering = ('-uploaded_at',)  
