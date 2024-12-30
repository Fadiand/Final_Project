from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse, JsonResponse

def instagram_callback(request):
    return JsonResponse({'message': 'Instagram callback is working!'})

def home(request):
    return HttpResponse('Hello, World!')

