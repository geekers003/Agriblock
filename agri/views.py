from django.http import JsonResponse
from django.contrib.auth import authenticate
import json

from .models import User


def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = authenticate(username=data['email'], password=data['password'])
        if user:
            return JsonResponse(dict(email=data['email']))
        return JsonResponse(dict(error='Username or password wrong'), status=401)
    elif request.method == 'OPTIONS':
        return JsonResponse(dict())
    return JsonResponse(dict(error='Invalid method'), status=405)


def issue_asset(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.get(email=data['user'])
        user.add_asset(data['asset'])
        return JsonResponse(dict(message='Added'))
    return JsonResponse(dict(error='Invalid method'), status=405)


def buy(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.get(email=data['user'])
        txn = user.add_transaction(data['name'], data['quantity'], data['seller'])
        if not txn:
            return JsonResponse(dict(message='Successful'))
        return JsonResponse(dict(error=txn), status=404)
    return JsonResponse(dict(error='Invalid method'), status=405)


def get_assets(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.get(email=data['user'])
        if 'dealer' in data:
            try:
                dealer = User.objects.get(email=data['dealer'])
                return JsonResponse(dict(assets=[asset.detail() for asset in dealer.assets.all()]))    
            except User.DoesNotExist:
                return JsonResponse(dict(error='Invalid id'), 401)
        return JsonResponse(dict(assets=[asset.detail() for asset in user.assets.all()]))
    return JsonResponse(dict(error='Invalid method'), status=405)

def get_transactions(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.get(email=data['user'])
        received = [txn.detail() for txn in user.bought.all()]
        sent = [txn.detail() for txn in user.sold.all()]
        return JsonResponse(dict(sent=sent, received=received))
    return JsonResponse(dict(error='Invalid method'), status=405)