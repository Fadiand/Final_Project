from logging import config
from django.shortcuts import render
from google.oauth2 import id_token
# Create your views here.
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from google.auth.transport.requests import Request  # ודא שהייבוא נכון
import json
from decouple import config


def instagram_callback(request):
    return JsonResponse({'message': 'Instagram callback is working!'})

def home(request):
    return HttpResponse('Hello, World!')


def webhook(request):
    if request.method == 'GET':
        verify_token = request.GET.get('hub.verify_token')
        challenge = request.GET.get('hub.challenge')

        # אימות ה-Verify Token
        if verify_token == 'vista':  # ערך שאתה מחליט עליו
            return JsonResponse({'hub.challenge': challenge}, status=200)
        else:
            return JsonResponse({'error': 'Invalid verify token'}, status=403)

    return JsonResponse({'error': 'Invalid request method'}, status=400)





@csrf_exempt
def google_auth(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            token = data.get('token')
            print("Received token:", token)  # למעקב

            # אימות הטוקן
            idinfo = id_token.verify_oauth2_token(
                token, Request(), config('GOOGLE_CLIENT_ID')
            )
            print("Token verified. Info:", idinfo)  # למעקב

            email = idinfo['email']
            name = idinfo.get('name', 'Unknown')  # אם אין שם, להגדיר 'Unknown'

            return JsonResponse({'message': 'Login successful', 'email': email, 'name': name})

        except ValueError as e:
            print("ValueError:", e)  # למעקב
            return JsonResponse({'error': 'Invalid token'}, status=400)
        except Exception as e:
            print("Exception:", e)  # למעקב
            return JsonResponse({'error': 'Server error'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid method'}, status=405)








