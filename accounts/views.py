from .models import Profile
from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User, auth
from django.contrib import messages
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, ProfileSerializer, LoginSerializer
from rest_framework.response import Response
from .forms import ProfileCreate


def register(request, *args, **kwargs):
    print("\ncalled register\n")
    if request.user.is_authenticated:
        return redirect("/")
    if request.method == "POST":
        print("\n", request.POST,"\n")
        print("\n", request.FILES,"\n")

        email = request.POST.get('email')
        username = request.POST.get('username')
        pswd1 = request.POST.get('password1')
        pswd2 = request.POST.get('password2')
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        if pswd1 != pswd2:
            print("\npswd != \n")
            return HttpResponse("try again")
        user = User.objects.filter(email__iexact=email).first()
        user2 = User.objects.filter(username__iexact=username).first()
        if user2 or user:
            messages.error(request, "user with this email or username exixts")
            return redirect("accounts:register")
        else:
            print("\n creating \n")
            user = User.objects.create_user(first_name=first_name, last_name=last_name, email=email,
                                            password=pswd1, username=username)
            user.save()
            prof = ProfileCreate(request.POST, request.FILES)
            if prof.is_valid:
                obj = prof.save(commit=False)
                obj.usr = user
                obj.save()
            return redirect("/")
    return render(request, "accounts/register.html")


def login(request, *args, **kwargs):
    if request.user.is_authenticated:
        return redirect("/")
    if request.method == 'POST':
        username = request.POST.get('username')
        pswd = request.POST.get('pswd')
        user = auth.authenticate(request, username=username, password=pswd)
        print("post")
        if user:
            auth.login(request, user)
            return redirect("/")
        else:
            return redirect("accounts:login")
    return render(request, "accounts/login.html")


def logout(request, *args, **kwargs):
    if request.user.is_authenticated:
        auth.logout(request)
        return redirect("/")
    return redirect("/")


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userinf(request):
    serialized = UserSerializer(request.user)
    return Response(serialized.data)


@api_view(['GET'])
def profile_view(request, pk, *args, **kwargs):
    user_obj = get_object_or_404(User, id=pk)
    profile_obj = get_object_or_404(Profile, usr=user_obj)
    return Response(ProfileSerializer(profile_obj).data)


@api_view(['POST'])
def login_api(request):
    print(request.data)
    serialized = LoginSerializer(data=request.data)
    if serialized.is_valid():
        print('valid')
        print(serialized.data)
        user = auth.authenticate(request, username=serialized.data.get('username'), password=serialized.data.get('pswd'))
        if not user:
            return Response(status=401)
        auth.login(request, user)
        return Response(status=200)
    return Response(status=400)