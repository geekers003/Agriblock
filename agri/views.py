from django.http import JsonResponse
from django.contrib.auth import authenticate

from .models import User


def login(request):
    data = request.POST.dict()
    user = authenticate(username=data['email'], password=data['password'])
    if user:
        return JsonResponse(dict(email=data['email']))
    return JsonResponse(dict(error='Username or password wrong'), status=401)


def issue_asset(request):
    data = request.POST.dict()
    user = User.objects.get(data['user'])
    user.add_asset(data['asset'])


def sell(request):
    data = request.POST.dict()
    user = User.objects.get(data['user'])
    user.add_transaction(data['name'], data['quantity'], data['buyer'])
