import instaloader
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def fetch_public_instagram_images(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get("username")

            if not username:
                return JsonResponse({"error": "Username is required"}, status=400)

            # יצירת אובייקט Instaloader
            L = instaloader.Instaloader()

            try:
                # טעינת הפרופיל מאינסטגרם
                profile = instaloader.Profile.from_username(L.context, username)
            except instaloader.exceptions.ProfileNotExistsException:
                return JsonResponse({"error": "Profile does not exist"}, status=404)

            # בדיקה אם הפרופיל פרטי
            if profile.is_private:
                return JsonResponse({"error": "This profile is private"}, status=403)

            images = []
            post_count = 0  # מגבלה על מספר התמונות שנחזיר

            # לולאה על הפוסטים של המשתמש (עד 5 פוסטים)
            for post in profile.get_posts():
                if post_count >= 5:  # מגבלת 5 תמונות
                    break

                images.append({
                    "image_url": post.url,  # URL של התמונה
                    "post_id": post.shortcode,  # מזהה הפוסט (לייחודיות)
                    "credit": f"Photo by @{profile.username} on Instagram (ID: {post.shortcode})"
                })

                post_count += 1

            # בדיקה אם אין פוסטים בכלל
            if not images:
                return JsonResponse({"message": "No images found for this user"}, status=200)

            return JsonResponse({"username": profile.username, "images": images}, status=200)

        except instaloader.exceptions.ProfileNotExistsException:
            return JsonResponse({"error": "Profile does not exist"}, status=404)
        except instaloader.exceptions.ConnectionException:
            return JsonResponse({"error": "Failed to connect to Instagram"}, status=500)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)
