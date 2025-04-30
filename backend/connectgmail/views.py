from logging import config
from google.oauth2 import id_token
# Create your views here.
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from google.auth.transport.requests import Request  # ודא שהייבוא נכון
import json
from decouple import config
from django.http import HttpResponse
from .models import gmail_users as gmail
from django.contrib.sessions.models import Session
from django.contrib.sessions.backends.db import SessionStore

def home(request):
    return HttpResponse("Hello, World!")
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from signup_app.models import User
from django.contrib.sessions.backends.db import SessionStore
from google.oauth2 import id_token
from google.auth.transport.requests import Request
import json
from decouple import config
from signup_app.views import send_welcome_email_if_first_login

 
@csrf_exempt
def google_auth(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            token = data.get('token')
            print("Received token from React:", token)

            idinfo = id_token.verify_oauth2_token(
                token, Request(), config('GOOGLE_CLIENT_ID')
            )

            email = idinfo.get('email', 'Unknown')
            name = idinfo.get('name', 'Unknown')
            picture = idinfo.get('picture', '')

            print(f"Google user: {name} ({email})")

            # חיפוש או יצירת משתמש בטבלת User הראשית
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': name,
                    'auth_provider': 'google',
                    'Is_active': True,
                    'password': '',  # אין סיסמה בגוגל
                }
            )

            if not created:
                # עדכון שם המשתמש אם כבר קיים
                user.username = name
                user.Is_active = True
                user.save()
            
            send_welcome_email_if_first_login(user)
    

            # יצירת סשן
            session = SessionStore()
            session['user_id'] = user.id
            session['email'] = user.email
            session.set_expiry(3600)  # שעה
            session.save()

            session_id = session.session_key

            print(f"✅ Google login successful: {user.username} | session_id: {session_id}")
            print(f"👤 is_superviser for {user.username}: {user.Is_superviser}")

            response = JsonResponse({
                'message': 'Login successful',
                'email': user.email,
                'username': user.username,
                'session_id': session_id,
                'Is_superviser': user.Is_superviser,
            })

            response.set_cookie('sessionid', session_id, httponly=True, samesite='Lax')

            return response

        except ValueError as e:
            print("❌ Invalid token:", e)
            return JsonResponse({'error': 'Invalid token'}, status=400)
        except Exception as e:
            print("❌ An error occurred:", e)
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'GET':
        users = list(User.objects.filter(auth_provider='google').values())
        return JsonResponse({'users': users})

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
