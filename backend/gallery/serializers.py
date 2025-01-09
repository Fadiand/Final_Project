from rest_framework import serializers
from .models import Image

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ('id', 'image', 'uploaded_at')  # השדות שיוחזרו

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['image'] = instance.image.url  # מוודא החזרת URL מלא
        return representation