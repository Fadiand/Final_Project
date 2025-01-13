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
            data = json.loads(request.body)
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")

            if not username or not email or not password:
                return JsonResponse({"error": "All fields are required."}, status=400)

            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already exists."}, status=400)

            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already exists."}, status=400)

            user = User(
                username=username,
                email=email,
                password=make_password(password),
            )
            user.save()

            print(f"User created: {user.username}, {user.email}")

            # מחזיר מידע על המשתמש בתגובה
            return JsonResponse({"username": user.username, "email": user.email}, status=201)

        except Exception as e:
            print(f"An error occurred: {e}")
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

        
@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    def post(self, request, *args, **kwargs):
        try:
            # קבלת הנתונים מהבקשה
            data = json.loads(request.body)

            # הדפסה של הנתונים בטרמינל
            print("Data received from React:", data)

            username = data.get("username")
            password = data.get("password")

            print(username, password)

            # בדיקת תקינות נתונים
            if not username or not password:
                return JsonResponse({"error": "All fields are required."}, status=400)

            # חיפוש המשתמש לפי שם המשתמש
            user = User.objects.filter(username=username).first()

            # אם המשתמש לא נמצא
            if not user:
                return JsonResponse({"error": "Username does not exist."}, status=404)

            # בדיקת התאמת הסיסמה
            if not user.check_password(password):
                return JsonResponse({"error": "Incorrect password."}, status=401)

            # התחברות הצליחה
            return JsonResponse({"message": "Login successful!", "username": user.username}, status=200)

        except Exception as e:
            print(f"An error occurred: {e}")  # הדפסת השגיאה בטרמינל
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
