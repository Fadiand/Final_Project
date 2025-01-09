import zipfile
from io import BytesIO
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import Image
from .serializers import ImageSerializer


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_images(request):
    """
    פונקציה להעלאת תמונות וקבצים ושמירתם כנתיבים.
    """
    if 'images' not in request.FILES:
        return Response({'error': 'No files provided'}, status=status.HTTP_400_BAD_REQUEST)

    # קבלת כל הקבצים מתוך הבקשה
    files = request.FILES.getlist('images')
    saved_images = []

    for file in files:
        # טיפול בקובץ ZIP
        if file.name.endswith('.zip'):
            try:
                with zipfile.ZipFile(file) as zf:
                    for filename in zf.namelist():
                        # בדיקה אם הקובץ בתוך ה-ZIP הוא תמונה
                        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                            file_data = zf.read(filename)
                            image_file = BytesIO(file_data)
                            image_file.name = filename  # נותן שם לקובץ
                            serializer = ImageSerializer(data={'image': image_file})
                            if serializer.is_valid():
                                serializer.save()
                                saved_images.append(serializer.data)
                            else:
                                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except zipfile.BadZipFile:
                return Response({'error': 'Invalid ZIP file'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # טיפול בקבצי תמונה רגילים
            serializer = ImageSerializer(data={'image': file})
            if serializer.is_valid():
                serializer.save()
                saved_images.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({'uploaded_images': saved_images}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_images(request):
    """
    פונקציה לשליפת כל התמונות הקיימות כנתיבים.
    """
    images = Image.objects.all()  # מביא את כל האובייקטים של תמונות
    serializer = ImageSerializer(images, many=True)  # ממיר את כל האובייקטים לנתונים בפורמט JSON
    return Response({'images': serializer.data}, status=status.HTTP_200_OK)