from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, \
    permission_classes, \
    authentication_classes

from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from rest_framework_jwt.settings import api_settings
from rest_framework.response import Response

JWT_PAYLOAD_HANDLER = api_settings.JWT_PAYLOAD_HANDLER
JWT_ENCODE_HANDLER = api_settings.JWT_ENCODE_HANDLER


@login_required(login_url='/')
def index(request):
    if request.method == 'GET':
        # user = request.user
        # payload = JWT_PAYLOAD_HANDLER(user)
        # token = JWT_ENCODE_HANDLER(payload)

        context = {
            # 'token': token
        }

        return render(request, 'chat.html', context=context)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JSONWebTokenAuthentication])
def chat_save(request):
    print('\nuser\n', request.user)
    print('\ndata\n', request.data)
    return Response(data={'username': request.user.username, 'id': request.user.id}, status=200)
