from django.http import JsonResponse
from django.views import View
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
from .models import User

@method_decorator(csrf_exempt, name='dispatch')
class SignUpView(View):
    def post(self, request, *args, **kwargs):
        try:
            # קבלת הנתונים מהבקשה
            data = json.loads(request.body)

            # הדפסה של הנתונים בטרמינל
            print("Data received from React:", data)

            username = data.get("username")
            email = data.get("email")
            password = data.get("password")
            
            print(username, email, password)

            # בדיקת תקינות נתונים
            if not username or not email or not password:
                return JsonResponse({"error": "All fields are required."}, status=400)

            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already exists."}, status=400)

            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already exists."}, status=400)

            # שמירת המשתמש בבסיס הנתונים
            user = User(
                username=username,
                email=email,
                password=make_password(password),  # שמירת סיסמה בצורה מאובטחת
            )
            user.save()

            print(f"User created: {user.username}, {user.email}")  # הדפסת המשתמש שנשמר

            return JsonResponse({"message": "User created successfully!"}, status=201)

        except Exception as e:
            print(f"An error occurred: {e}")  # הדפסת השגיאה בטרמינל
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
