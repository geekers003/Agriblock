from django.urls import path

from .views import *

rest_urls = list(map(lambda x: path(x[0], x[1], name=x[2]), [
    ('login/', login, 'login'),
    ('issue_asset/', issue_asset, 'issue_asset'),
    ('buy/', buy, 'buy'),
    ('get_assets/', get_assets, 'get_assets'),
    ('get_transactions/', get_transactions, 'get_transactions')
]))

urlpatterns = rest_urls
