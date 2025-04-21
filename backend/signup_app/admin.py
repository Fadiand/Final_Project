from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'auth_provider', 'last_login', 'Is_active', 'Is_superviser','first_login')
    list_filter = ('Is_active', 'Is_superviser', 'auth_provider', 'last_login')
    list_editable = ("Is_superviser",)
    search_fields = ('username', 'email')
    readonly_fields = ('last_login',)

    fieldsets = (
        (None, {
            'fields': ('username', 'email', 'auth_provider', 'password')
        }),
        ('Permissions', {
            'fields': ('Is_active', 'Is_superviser')
        }),
        ('Meta', {
            'fields': ('last_login',)
        }),
    )
