from django.http.response import JsonResponse
from rest_framework import status
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.decorators import api_view
from .serializers import UserSerializer
from .models import User, Package
from django.db.models import Q
from django.contrib.auth.hashers import make_password, check_password
import jwt
from random import randint
from django.conf import settings
from django.core.mail import send_mail
from django.core.files.storage import FileSystemStorage

from django.core import serializers
from django.http import HttpResponse

# Create your views here.
@api_view(['POST'])
def signin(request):
    if request.method == 'POST':
        # user_data = JSONParser().parse(request.info)
        user_data=JSONParser().parse(request)

        criterion1 = Q(username=user_data['username'])
        criterion2 = Q(email=user_data['username'])

        if user_data and User.objects.filter(criterion1 | criterion2).exists():
            user = User.objects.get(criterion1 | criterion2)
            user_serializer = UserSerializer(user)

            if user_serializer.data and check_password(user_data['password'], user_serializer.data['password']):
                encoded = jwt.encode({'id': user_serializer.data['id']}, 'TestProofSecretKey', algorithm='HS256')
                return JsonResponse({'status': True, 'message': 'Successfully signin', 'data': user_serializer.data, 'token': encoded}, safe=False)
            else:
                return JsonResponse({'status': False, 'message': 'The credential is incorrect'}, safe=False)

    return JsonResponse({'status': False, 'message': 'The credential is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)
    # return JsonResponse({'status': False, 'message': user_data['password']}, safe=False)
    # return JsonResponse({'status': False, 'message': 'The credential is incorrect'}, safe=False)

@api_view(['POST'])
def signup(request):
    if request.method == 'POST':
        user_data = JSONParser().parse(request)
        if User.objects.filter(Q(username=user_data['username']) | Q(email=user_data['email'])).exists():
            return JsonResponse({'status': False, 'message': 'A user with username or email is already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            email=user_data['email'],
            username=user_data['username'],
            package=user_data['package'],
            password=make_password(user_data['password'])
        )
        user.save()
        return JsonResponse({'status': True, 'message': 'Successfully signup'}, safe=False)

    return JsonResponse({'status': False, 'message': 'Input error'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def userdetail(request, pk):
    # find tutorial by pk (id)
    try:
        user = User.objects.get(pk=pk)
        if request.method == 'GET':
            user_serializer = UserSerializer(user)
            return JsonResponse(user_serializer.data)
        elif request.method == 'PUT':
            user_data = JSONParser().parse(request)
            user_serializer = UserSerializer(user, data=user_data)
            if user_serializer.is_valid():
                user_serializer.save()
                return JsonResponse(user_serializer.data)
            return JsonResponse(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif request.method == 'DELETE':
            user.delete()
            return JsonResponse({'message': 'User was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def forgotPasswordToConfirmEmail(request):
    user_data = JSONParser().parse(request)

    if user_data:
        if User.objects.filter(email=user_data['email']).exists():

            user = User.objects.get(email=user_data['email'])
            user.code = randint(1000000, 9999999)

            print(user.code)

            user.save()

            subject = 'Welcome to TestProof'
            message = f'Hi {user.username}, Verification code: ${user.code}'
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [user.email, ]
            # send_mail(subject, message, email_from, recipient_list)

            return JsonResponse({'status': True})
        else:
            return JsonResponse({'status': False, 'message': 'User with the email not found'})

    return JsonResponse({'status': False, 'message': 'User not found'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def forgotPassword(request):
    user_data = JSONParser().parse(request)

    if user_data:
        if User.objects.filter(email=user_data['email'], code=user_data['code']).exists():

            user = User.objects.get(email=user_data['email'])
            user.password = make_password(user_data['password'])
            user.save()

            return JsonResponse({'status': True})
        else:
            return JsonResponse({'status': False, 'message': 'User with the email not found'})

    return JsonResponse({'status': False, 'message': 'Code is incorrect. please check your email.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def uploadFile(request):
    if 'avatar' in request.FILES:
        avatar = request.FILES['avatar']
        fs = FileSystemStorage()
        filename = fs.save(avatar.name, avatar)
        uploaded_file_url = fs.url(avatar)
        return JsonResponse({'status': True, 'data': uploaded_file_url})
    else:
        return JsonResponse({'status': False})

@api_view(['PUT'])
def updateProfile(request):
    user_data = JSONParser().parse(request)
    print(user_data)

    if user_data:
        if User.objects.filter(username=user_data['username']).exists():
            user = User.objects.get(username=user_data['username'])

            if 'fullName' in user_data and 'title' in user_data and 'email' in user_data:
                user.fullName = user_data['fullName']
                user.title = user_data['title']
                user.email = user_data['email']
            if 'avatar' in user_data:
                user.avatar = user_data['avatar']

            if 'oldPassword' in user_data and 'newPassword' in user_data:
                oldPassword = user_data['oldPassword']
                newPassword = user_data['newPassword']
                
                user_serializer = UserSerializer(user)
                if user_serializer.data and check_password(oldPassword, user_serializer.data['password']):
                    user.password = make_password(newPassword)
                else:
                    return JsonResponse({'status': False, 'message': 'Old password is incorrect'})
            user.save()
            new_user_serializer = UserSerializer(user)

            return JsonResponse({'status': True, 'data': new_user_serializer.data})
        else:
            return JsonResponse({'status': False, 'message': 'User with the email not found'})

    return JsonResponse({'status': False, 'message': 'Code is incorrect. please check your email.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def getPackageOptions(request):
    packages = Package.objects.all()
    package_list = serializers.serialize('json', packages)
    # return HttpResponse(package_list)
    return JsonResponse({'status': 200, 'data': package_list})
@api_view(['GET'])
def test(request):
    # return JsonResponse({'state': 200, 'data': 'test view'})
    return HttpResponse("You're voting on question.")