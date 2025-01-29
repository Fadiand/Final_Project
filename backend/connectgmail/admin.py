from django.contrib import admin
from .models import gmail_users

# מחלקת admin מותאמת
class gmail_usersAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'Is_active', 'Is_superviser')  # עמודות להצגה בטבלה
    list_filter = ('Is_active', 'Is_superviser')  # פילטרים בצד ימין

# חיבור מחלקת ה-Admin למודל
admin.site.register(gmail_users, gmail_usersAdmin)
