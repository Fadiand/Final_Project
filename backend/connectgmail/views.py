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

@csrf_exempt
def google_auth(request):
    if request.method == 'POST':
        try:
            # קבלת הנתונים מהבקשה
            data = json.loads(request.body)
            token = data.get('token')

            # הדפסת הנתונים שהתקבלו (לטובת בדיקה בטרמינל)
            print("Received data from React:", data)

            # אימות הטוקן
            idinfo = id_token.verify_oauth2_token(
                token, Request(), config('GOOGLE_CLIENT_ID')
            )

            # הפקת נתונים מהטוקן
            email = idinfo.get('email', 'Unknown')
            name = idinfo.get('name', 'Unknown')

            # שמירת הנתונים במודל gmail
            gmail_entry, created = gmail.objects.get_or_create(
                email=email,
                defaults={'name': name}
            )
            if not created:
                # אם הרשומה כבר קיימת, עדכן את השם
                gmail_entry.name = name
                gmail_entry.Is_active = True
                gmail_entry.save()

            # יצירת Session חדש
            session = SessionStore()  # הגדרת אובייקט session
            session['user_id'] = gmail_entry.id
            session['email'] = gmail_entry.email
            session['is_active'] = gmail_entry.Is_active
            session.set_expiry(3600)  # Session יפוג תוך שעה (3600 שניות)
            session.save()  # שמירה מפורשת של הסשן

            session_id = session.session_key  # קבלת מזהה ה-Session

            # הדפסת מידע לטרמינל
            print(f"User authenticated: {gmail_entry.name}, {gmail_entry.email}, session_id: {session_id}")

            # יצירת response עם הגדרת Cookie ל-Session
            response = JsonResponse({
                'message': 'Login successful',
                'email': email,
                'name': name,
                'session_id': session_id  # שליחת session_id ל-Frontend
            })
            
            response.set_cookie('sessionid', session_id, httponly=True, samesite='Lax')

            return response
            
        except ValueError as e:
            print("Invalid token:", e)
            return JsonResponse({'error': 'Invalid token'}, status=400)
        except Exception as e:
            print("An error occurred:", e)
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'GET':
        # החזרת מידע לדוגמה (או מידע מהדאטהבייס אם צריך)
        users = list(gmail.objects.values())
        return JsonResponse({'users': users})

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
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

@csrf_exempt
def google_auth(request):
    if request.method == 'POST':
        try:
            # קבלת הנתונים מהבקשה
            data = json.loads(request.body)
            token = data.get('token')

            # הדפסת הנתונים שהתקבלו (לטובת בדיקה בטרמינל)
            print("Received data from React:", data)

            # אימות הטוקן
            idinfo = id_token.verify_oauth2_token(
                token, Request(), config('GOOGLE_CLIENT_ID')
            )

            # הפקת נתונים מהטוקן
            email = idinfo.get('email', 'Unknown')
            name = idinfo.get('name', 'Unknown')

            # שמירת הנתונים במודל gmail
            gmail_entry, created = gmail.objects.get_or_create(
                email=email,
                defaults={'name': name}
            )
            if not created:
                # אם הרשומה כבר קיימת, עדכן את השם
                gmail_entry.name = name
                gmail_entry.Is_active = True
                gmail_entry.save()

            # יצירת Session חדש
            session = SessionStore()  # הגדרת אובייקט session
            session['user_id'] = gmail_entry.id
            session['email'] = gmail_entry.email
            session['is_active'] = gmail_entry.Is_active
            session.set_expiry(3600)  # Session יפוג תוך שעה (3600 שניות)
            session.save()  # שמירה מפורשת של הסשן

            session_id = session.session_key  # קבלת מזהה ה-Session

            # הדפסת מידע לטרמינל
            print(f"User authenticated: {gmail_entry.name}, {gmail_entry.email}, session_id: {session_id}")

            # יצירת response עם הגדרת Cookie ל-Session
            response = JsonResponse({
                'message': 'Login successful',
                'email': email,
                'name': name,
                'session_id': session_id  # שליחת session_id ל-Frontend
            })
            
            response.set_cookie('sessionid', session_id, httponly=True, samesite='Lax')

            return response
            
        except ValueError as e:
            print("Invalid token:", e)
            return JsonResponse({'error': 'Invalid token'}, status=400)
        except Exception as e:
            print("An error occurred:", e)
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'GET':
        # החזרת מידע לדוגמה (או מידע מהדאטהבייס אם צריך)
        users = list(gmail.objects.values())
        return JsonResponse({'users': users})

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)