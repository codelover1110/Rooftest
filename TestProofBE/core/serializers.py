from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
                    'id',
                    'avatar',
                    'username',
                    'email',
                    'package',
                    'password',
                    'fullName',
                    'title',
                    'code',
                    'isTFA',
                    'isVerified'
                  )
