from django.contrib import admin

from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):

    list_display = ('username', 'email','last_login','Is_active','Is_superviser') 
    list_filter = ('Is_active', 'Is_superviser', 'last_login')
    
    list_editable = ("Is_superviser",) # זה בתכלס של התכלס נותן לי אופציה לערוך את השדה הזה ידנית מהאדמין
