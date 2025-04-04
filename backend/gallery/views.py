from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import Image_user
from .serializers import ImageUserSerializer
import zipfile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.sessions.backends.db import SessionStore

from signup_app.models import User

import tensorflow as tf
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from PIL import Image
import os
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes

from rest_framework.decorators import api_view, permission_classes
import requests
from io import BytesIO



# ✅ הגדרת הנתיב למודל
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  
MODEL_PATH = os.path.join(BASE_DIR, "../vista-model/classification/predict_image_demonstration/view_model_round_3.h5")
print(f"🔹 Trying to load model from: {MODEL_PATH}")  

# ✅ טעינת המודל
model = tf.keras.models.load_model(MODEL_PATH)
print("✅ Model loaded successfully!")


@csrf_exempt
def classify_image(request):
    if request.method == "POST" and request.FILES.get("image"):
        try:
            # 🔹 זיהוי המשתמש
            user = get_user_from_session(request)
            user_info = f"{user.username} ({user.email})" if user else "Anonymous"
            print(f"🔹 Classifying image for: {user_info}")

            # 🔹 קבלת קובץ תמונה
            image_file = request.FILES["image"]
            print(f"📸 קובץ התקבל: {image_file.name}, גודל: {image_file.size} bytes")

            # 🔹 המרת הקובץ לתמונה בפורמט RGB
            image = Image.open(image_file).convert("RGB")
            image = image.resize((224, 224))  
            image_array = np.array(image)  
            image_array = np.expand_dims(image_array, axis=0)  

            # ✅ בדיקה שהתמונה מעובדת נכון
            print(f"🔹 תמונה עובדה בהצלחה: צורה {image_array.shape}")

            # 🔹 הרצת התמונה דרך המודל
            prediction = model.predict(image_array)[0]  
            predicted_class = np.argmax(prediction)  

            # 🔹 הגדרת תוצאה
            classification = "תיירות" if predicted_class == 1 else "לא תיירות"
            confidence = float(prediction[predicted_class])  

            # ✅ הדפסת תוצאת המודל לטרמינל
            print(f"🟢 תוצאה: {classification}, ביטחון: {confidence:.4f}")

            return JsonResponse({
                "user": user_info,  # ✅ מחזיר את המשתמש (אם מזוהה)
                "classification": classification,
                "confidence": confidence,
                "raw_output": prediction.tolist()  
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "שלח תמונה בפורמט POST"}, status=400)


# 🔹 פונקציה לזיהוי משתמש דרך ה-Session וה-Cookies
def get_user_from_session(request):
    session_key = request.COOKIES.get('sessionid')
    print(f"🔹 Cookie sessionid: {session_key}")  

    if not session_key:
        print("🔴 No session key found in cookies (Anonymous User)")
        return None

    session = SessionStore(session_key=session_key)
    user_id = session.get('user_id')
    print(f"🔹 Retrieved user_id from session: {user_id}")

    if not user_id:
        print("🔴 No user_id found in session data (Anonymous User)")
        return None

    try:
        user = User.objects.get(id=user_id)
        print(f"✅ User found: {user.username} ({user.email}), Is_active: {user.Is_active}")  
        return user
    except User.DoesNotExist:
        print("🔴 User not found in database")
        return None
    

# 🔹 **View להעלאת תמונות**
@csrf_exempt  
@api_view(['POST'])
@permission_classes([AllowAny]) 
@parser_classes([MultiPartParser, FormParser])
def upload_images(request):
    print("🔹 Upload request received")

    # **מזהה משתמש אם קיים**
    user = get_user_from_session(request)
    if user:
        print(f"✅ Uploading images for user: {user.username} ({user.email})")
    else:
        print("❌ No user found in session. Uploading images anonymously.")
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

    files = request.FILES.getlist('images')
    if not files:
        return Response({'error': 'No files provided'}, status=status.HTTP_400_BAD_REQUEST)

    saved_images = []

    for file in files:
        if file.name.lower().endswith('.zip'):
            try:
                with zipfile.ZipFile(file) as zf:
                    for filename in zf.namelist():
                        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                            file_data = zf.read(filename)
                            image_file = SimpleUploadedFile(filename, file_data)
                            serializer = ImageUserSerializer(data={'image': image_file})
                            if serializer.is_valid():
                                serializer.save(user=user)
                                saved_images.append(serializer.data)
                            else:
                                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except zipfile.BadZipFile:
                return Response({'error': 'Invalid ZIP file'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = ImageUserSerializer(data={'image': file})
            if serializer.is_valid():
                serializer.save(user=user)
                saved_images.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({'uploaded_images': saved_images}, status=status.HTTP_201_CREATED)



@csrf_exempt  
@api_view(['GET'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def get_images(request):
    print("🔹 Fetching images")

    # **מזהה משתמש אם קיים**
    user = get_user_from_session(request)
    if user:
        print(f"✅ Fetching images for user: {user.username} ({user.email})")
        images = Image_user.objects.filter(user=user)
    else:
        print(" No user found in session. Fetching all images.")  
        images = []

    serializer = ImageUserSerializer(images, many=True)
    return Response({'images': serializer.data}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([AllowAny]) 
def delete_image(request, image_id):
    user = get_user_from_session(request)
    
    if not user:
        print(" Authentication failed: Invalid session")
        return Response({"error": "Authentication failed: Invalid session"}, status=status.HTTP_403_FORBIDDEN)

    try:
        image = Image_user.objects.get(id=image_id)

        # ✅ בדיקה שהתמונה שייכת למשתמש (אם רלוונטי)
        if image.user != user:
            return Response({"error": "You are not authorized to delete this image"}, status=status.HTTP_403_FORBIDDEN)

        # ✅ מחיקת הקובץ מהשרת
        if image.image and os.path.exists(image.image.path):
            os.remove(image.image.path)

        # ✅ מחיקת הרשומה מהמסד נתונים
        image.delete()
        return Response({'message': f'Image {image_id} deleted successfully'}, status=status.HTTP_200_OK)

    except Image_user.DoesNotExist:
        return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({'error': f'Failed to delete image: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)