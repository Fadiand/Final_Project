from django.contrib import admin

from .models import gmail_users

admin.site.register(gmail_users)

class gmail_usersAdmin(admin.ModelAdmin):
    list_display = ['email', 'name']
    list_filter = ['email', 'name']
# Register your models here.
