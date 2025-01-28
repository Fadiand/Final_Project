from rest_framework.decorators import api_view, parser_classes, permission_classes, authentication_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny  # מחלקת ההרשאות שמאפשרת גישה לכולם
from rest_framework.authentication import BasicAuthentication, SessionAuthentication  # ביטול כל אימות
from .models import Image_user
from .serializers import ImageUserSerializer
import zipfile
from io import BytesIO
from django.core.files.uploadedfile import SimpleUploadedFile


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([AllowAny])  # הרשאה לכולם
@authentication_classes([])  # ביטול אימות
def upload_images(request):
    """
    View להעלאת תמונות (כולל קבצי ZIP).
    """
    if 'images' not in request.FILES:
        return Response({'error': 'No files provided'}, status=status.HTTP_400_BAD_REQUEST)

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
                                serializer.save()
                                saved_images.append(serializer.data)
                            else:
                                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except zipfile.BadZipFile:
                return Response({'error': 'Invalid ZIP file'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # אם זה לא ZIP, העלה את התמונה כרגיל
            serializer = ImageUserSerializer(data={'image': file})
            if serializer.is_valid():
                serializer.save()
                saved_images.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({'uploaded_images': saved_images}, status=status.HTTP_201_CREATED)




@api_view(['GET'])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([AllowAny])  # הרשאה לכולם
@authentication_classes([])  # ביטול אימות
def get_images(request):
    """
    View לשליפת כל התמונות שהועלו.
    """
    images = Image_user.objects.all()  # שליפת כל האובייקטים של תמונות
    serializer = ImageUserSerializer(images, many=True)  # המרת האובייקטים לפורמט JSON
    return Response({'images': serializer.data}, status=status.HTTP_200_OK)