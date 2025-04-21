import json
import requests
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.sessions.backends.db import SessionStore
from .models import facebook_users  # ניצור את המודל הזה עוד רגע
from signup_app.models import User 
from signup_app.views import send_welcome_email_if_first_login


@csrf_exempt
def facebook_auth(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            access_token = data.get('access_token')

            print("🔹 Received Facebook token:", access_token)

            # שלב 1: קבלת מידע מה-Graph API
            url = f"https://graph.facebook.com/me?fields=id,name,email,picture&access_token={access_token}"
            fb_response = requests.get(url)
            fb_data = fb_response.json()
            print("🔹 Facebook data:", fb_data)

            if 'error' in fb_data or 'email' not in fb_data:
                return JsonResponse({'error': 'Invalid Facebook token or missing email'}, status=400)

            name = fb_data['name']
            email = fb_data['email']
            picture = fb_data.get('picture', {}).get('data', {}).get('url', '')

            # שלב 2: הכנסת המשתמש לטבלת User הראשית
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': name,
                    'auth_provider': 'facebook',
                    'Is_active': True,
                    'Is_superviser': False,
                    'password': '',  # אין סיסמה בפייסבוק
                }
            )

            if not created:
                user.username = name  # עדכון שם
                user.Is_active = True
                user.save()
                
            send_welcome_email_if_first_login(user)
    

            # שלב 3: יצירת סשן
            session = SessionStore()
            session['user_id'] = user.id
            session['email'] = user.email
            session.set_expiry(3600)
            session.save()

            print(f"✅ Facebook user logged in: {user.email}, session_id: {session.session_key}")

            # שלב 4: שליחת תגובה לפרונט
            response = JsonResponse({
                'message': 'Facebook login successful',
                'email': user.email,
                'username': user.username,
                'session_id': session.session_key,
                'is_active': user.Is_active,
            })

            response.set_cookie('sessionid', session.session_key, httponly=True, samesite='Lax')
            return response

        except Exception as e:
            print("❌ Error in facebook_auth:", e)
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'GET':
        users = list(User.objects.filter(auth_provider='facebook').values())
        return JsonResponse({'users': users})

    return JsonResponse({'error': 'Method not allowed'}, status=405)