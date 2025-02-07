from django.contrib import admin
from .models import Image_user  # ייבוא המודל

@admin.register(Image_user)
class ImageUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'image', 'uploaded_at','user') 
    list_filter = ('uploaded_at','user') 
    search_fields = ('image',) 
    ordering = ('-uploaded_at',)  