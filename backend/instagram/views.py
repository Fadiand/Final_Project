from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests
from bs4 import BeautifulSoup
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes


import random

@api_view(['GET'])
@permission_classes([AllowAny]) 
def hashtag_search(request):
    tag = request.GET.get('tag')
    if not tag:
        return Response({'error': 'Missing hashtag'}, status=status.HTTP_400_BAD_REQUEST)

    search_url = f"https://www.google.com/search?tbm=isch&q=site:instagram.com+%23{tag}"
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    try:
        response = requests.get(search_url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')

        image_elements = soup.find_all("img")
        image_urls = []

        for img in image_elements:
            src = img.get("src")
            if src and src.startswith("http"):
                image_urls.append(src)

        # ✅ ערבוב לפני חיתוך
        random.shuffle(image_urls)
        return Response({'images': image_urls[:14]})
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
