from rest_framework.decorators import api_view, parser_classes, permission_classes, authentication_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from .models import Image_user
from .serializers import ImageUserSerializer
import zipfile
from io import BytesIO
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.sessions.backends.db import SessionStore
#from django.contrib.auth.models import User  #אנייי ללאאאאא מאמיןןןןן!!!!!!!!!!!!!!!!
from signup_app.models import User # זה הנכון
from django.views.decorators.csrf import csrf_exempt  


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
    
    

@csrf_exempt  
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([AllowAny])
#@authentication_classes([])
def upload_images(request):
    """
    View להעלאת תמונות (כולל קבצי ZIP) **רק עבור משתמש מחובר ופעיל**.
    """
    
    """
    
    # בדיקה אם המשתמש מחובר
    session_id = request.COOKIES.get('sessionid')
    if not session_id:
        return Response({'error': 'User is not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    # קבלת ה-User מתוך ה-Session
    session = SessionStore(session_key=session_id)
    user_id = session.get('user_id')

    if not user_id:
        return Response({'error': 'Invalid session, please log in again'}, status=status.HTTP_401_UNAUTHORIZED)

    user = User.objects.filter(id=user_id).first()
    if not user:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # בדיקה אם המשתמש **פעיל**
    if not user.is_active:
        return Response({'error': 'User is not active. Please log in again.'}, status=status.HTTP_403_FORBIDDEN)
        
        
    """
    
    user = get_user_from_session(request)
    if user:
        print(f"✅ Uploading images for user: {user.username} ({user.email})")
    else:
        print("❌ No user found in session. Uploading images anonymously.")

    files = request.FILES.getlist('images')
    saved_images = []

    for file in files:
        # אם הקובץ הוא ZIP, פתח אותו והעלה את כל התמונות שבו
        if file.name.endswith('.zip'):
            try:
                with zipfile.ZipFile(file) as zf:
                    for filename in zf.namelist():
                        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                            file_data = zf.read(filename)
                            image_file = SimpleUploadedFile(filename, file_data)
                            serializer = ImageUserSerializer(data={'image': image_file})
                            if serializer.is_valid():
                                image_instance = serializer.save(user=user)  # שמירת התמונה עם המשתמש
                                saved_images.append(ImageUserSerializer(image_instance).data)
                            else:
                                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except zipfile.BadZipFile:
                return Response({'error': 'Invalid ZIP file'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # אם זה לא ZIP, העלה את התמונה כרגיל
            serializer = ImageUserSerializer(data={'image': file})
            if serializer.is_valid():
                image_instance = serializer.save(user=user)  # שמירת התמונה עם המשתמש
                saved_images.append(ImageUserSerializer(image_instance).data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({'uploaded_images': saved_images}, status=status.HTTP_201_CREATED)

@csrf_exempt  
@api_view(['GET'])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([AllowAny])
#@authentication_classes([])
def get_images(request):
    """
    View לשליפת **רק התמונות של המשתמש המחובר והפעיל**.
    """
    
    """
      session_id = request.COOKIES.get('sessionid')
    if not session_id:
        return Response({'error': 'User is not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    # קבלת ה-User מתוך ה-Session
    session = SessionStore(session_key=session_id)
    user_id = session.get('user_id')

    if not user_id:
        return Response({'error': 'Invalid session, please log in again'}, status=status.HTTP_401_UNAUTHORIZED)

    user = User.objects.filter(id=user_id).first()
    if not user:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # בדיקה אם המשתמש **פעיל**
    if not user.is_active:
        return Response({'error': 'User is not active. Please log in again.'}, status=status.HTTP_403_FORBIDDEN)
        
    """
    
    user = get_user_from_session(request)
    if user:
        print(f"✅ Uploading images for user: {user.username} ({user.email})")
    else:
        print("❌ No user found in session. Uploading images anonymously.")


    # שליפת כל התמונות ששייכות **רק למשתמש הנוכחי**
    images = Image_user.objects.filter(user=user)
    serializer = ImageUserSerializer(images, many=True)

    return Response({'images': serializer.data}, status=status.HTTP_200_OK)