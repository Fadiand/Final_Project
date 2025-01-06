from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse, JsonResponse

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


