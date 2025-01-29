from rest_framework import serializers

from .models import Image_user

class ImageUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image_user
        fields = ('id', 'image', 'uploaded_at')  # שדות שיוחזרו ב-API

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['image'] = instance.image.url if instance.image else None  # החזרת ה-URL המלא של התמונה
        return representation