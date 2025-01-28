from django.http import JsonResponse
from django.views import View
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
from .models import User
from connectgmail.models import gmail_users  # המודל של משתמשי Google
from django.contrib.auth import login
from django.contrib.auth import logout



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
            
             # חיבור אוטומטי של המשתמש ל-Session
            login(request, user)


            print(f"User created: {user.username}, {user.email}")

            # מחזיר מידע על המשתמש בתגובה
            return JsonResponse({"id":user.id ,"username": user.username, "email": user.email}, status=201)

        except Exception as e:
            print(f"An error occurred: {e}")
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

        
@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")

            print(f"Username received: {username}")
            print(f"Password received: {password}")

            if not username or not password:
                print("Missing username or password")
                return JsonResponse({"error": "Both fields are required."}, status=400)

            user = User.objects.filter(username=username).first()
            if not user:
                print(f"User not found for username: {username}")
                return JsonResponse({"error": "Invalid credentials."}, status=401)

            if not user.check_password(password):
                print("Password check failed")
                return JsonResponse({"error": "Invalid credentials."}, status=401)
            

            login(request, user)
            print(f"User {username} logged in successfully")
            
            user.Is_active = True
            user.save() # חשוב!!!!!!!!!!!!!!!!!!!!!!!!

            return JsonResponse({
                "message": "Login successful!",
                "username": user.username,
                "user_id": user.id,
                "Is_active":user.Is_active,
            }, status=200)
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            return JsonResponse({"error": "An unexpected error occurred. Please try again."}, status=500)


    
@method_decorator(csrf_exempt, name='dispatch')
class LogOut(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            username = data.get("username")
            
            if not username :
                return JsonResponse({"massage" : "username not found"})
            
            user = User.objects.filter(username=username).first()
            
            if not user :
                return JsonResponse({"massage" : "user not found in the database , u need to create it first"})
            
            user.Is_active = False
            user.save()
            
            logout(request)
            return JsonResponse({"message": "Logout successful. Session deleted and user deactivated."}, status=200)    
                
        except Exception as e:
               print(f"An error occurred: {e}")
               return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)