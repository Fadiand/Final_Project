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
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from apify_client import ApifyClient
from decouple import config
import traceback
import re
import random
from urllib.parse import unquote
from django.http import HttpResponse



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
    


@api_view(["GET"])
@permission_classes([AllowAny])
def proxy_image(request):
    image_url = request.GET.get("url")
    if not image_url:
        return HttpResponse("Missing URL", status=400)

    try:
        response = requests.get(unquote(image_url), stream=True)
        return HttpResponse(response.content, content_type=response.headers["Content-Type"])
    except Exception as e:
        return HttpResponse(f"Failed to fetch image: {e}", status=500)


@csrf_exempt
@permission_classes([AllowAny])
def extract_image_from_post(item):
    """
    מקבל פריט אחד מ־Apify ומוציא ממנו את ה־image_url התקין.
    """
    image_url = item.get("displayUrl") or item.get("imageUrl")

    # אם יש רשימה של תמונות
    if not image_url and isinstance(item.get("imageUrls"), list):
        image_url = item["imageUrls"][0]

    # אם אין בכלל – ננסה לגרד את התמונה מתוך דף HTML
    if not image_url and item.get("url"):
        try:
            headers = {"User-Agent": "Mozilla/5.0"}
            response = requests.get(item["url"], headers=headers, timeout=5)
            soup = BeautifulSoup(response.text, "html.parser")
            meta_tag = soup.find("meta", property="og:image")
            if meta_tag:
                image_url = meta_tag.get("content")
        except Exception as e:
            print(f"⚠️ שגיאה בגירוד תמונה: {e}")

    return image_url


@csrf_exempt
@permission_classes([AllowAny])
def fetch_instagram_images(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            hashtag = data.get("hashtag")
            if not hashtag:
                return JsonResponse({"error": "Missing 'hashtag' parameter"}, status=400)

            client = ApifyClient(config("APIFY_API_TOKEN"))

            run_input = {
                "hashtags": [hashtag],
                "resultsType": "posts", 
                "resultsLimit": 1,
            }

            run = client.actor("apify/instagram-hashtag-scraper").call(run_input=run_input)
            items = client.dataset(run["defaultDatasetId"]).list_items().items

            image_urls = []
            for item in items:
                # נוודא שזה באמת קשור להאשטג שלנו
                caption = item.get("caption", "")
                hashtags = re.findall(r"#\w+", caption.lower())
                if f"#{hashtag.lower()}" not in hashtags:
                    continue

                image_url = extract_image_from_post(item)
                if image_url:
                    image_urls.append(image_url)

            return JsonResponse({"image_urls": image_urls})

        except Exception as e:
            traceback.print_exc()
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)
