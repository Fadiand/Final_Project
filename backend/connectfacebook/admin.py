# connectfacebook/admin.py

from django.contrib import admin
from .models import facebook_users

class facebook_usersAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'Is_active') 
    list_filter = ('Is_active',)                   
    search_fields = ('email', 'name')              

admin.site.register(facebook_users, facebook_usersAdmin)
