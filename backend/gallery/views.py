from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny  # ❗ גישה פתוחה לכולם
from .models import Image_user
from .serializers import ImageUserSerializer
import zipfile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.sessions.backends.db import SessionStore
from signup_app.models import User
from django.views.decorators.csrf import csrf_exempt  

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
    

# 🔹 **View להעלאת תמונות - פתוח לכולם אבל מזהה משתמשים**
@csrf_exempt  
@api_view(['POST'])
@permission_classes([AllowAny])  # ❗ גישה פתוחה לכולם
@parser_classes([MultiPartParser, FormParser])
def upload_images(request):
    print("🔹 Upload request received")

    # **מזהה משתמש אם קיים**
    user = get_user_from_session(request)
    if user:
        print(f"✅ Uploading images for user: {user.username} ({user.email})")
    else:
        print("❌ No user found in session. Uploading images anonymously.")

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
                                serializer.save(user=user)  # ✅ שומר עם user אם מחובר, אחרת user=None
                                saved_images.append(serializer.data)
                            else:
                                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except zipfile.BadZipFile:
                return Response({'error': 'Invalid ZIP file'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = ImageUserSerializer(data={'image': file})
            if serializer.is_valid():
                serializer.save(user=user)  # ✅ שומר עם user אם מחובר, אחרת user=None
                saved_images.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({'uploaded_images': saved_images}, status=status.HTTP_201_CREATED)


# 🔹 **View לשליפת תמונות - פתוח לכולם אבל מזהה משתמשים**
@csrf_exempt  
@api_view(['GET'])
@permission_classes([AllowAny])  # ❗ גישה פתוחה לכולם
@parser_classes([MultiPartParser, FormParser])
def get_images(request):
    print("🔹 Fetching images")

    # **מזהה משתמש אם קיים**
    user = get_user_from_session(request)
    if user:
        print(f"✅ Fetching images for user: {user.username} ({user.email})")
        images = Image_user.objects.filter(user=user)
    else:
        print("❌ No user found in session. Fetching all images.")  
        images = Image_user.objects.all()  # 🔥 עכשיו מחזיר **את כל התמונות** אם המשתמש לא מחובר

    serializer = ImageUserSerializer(images, many=True)
    return Response({'images': serializer.data}, status=status.HTTP_200_OK)
