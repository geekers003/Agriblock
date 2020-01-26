from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager

from .utils import get_hash
import json


class UserManager(BaseUserManager):
    def create_user(self, details):
        """
        Creates and saves a User with the given contact, password
        """
        password = details['password']
        del details['password']
        details['hash'] = get_hash(details['email'])
        user = self.model(**details)
        user.set_password(password)
        user.save(using=self._db)
        Block.create_block(user.detail())
        return user


class Block(models.Model):
    previous_hash = models.TextField()
    hash = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()

    def detail(self):
        return {
            'previous_hash': self.previous_hash,
            'hash': self.hash,
            'created_at': str(self.created_at)
        }

    @staticmethod
    def create_block(data):
        last_block = Block.objects.last()
        print(data)
        if not last_block:
            last_hash = '0'
            last_detail = dict()
        else:
            last_hash = last_block.hash
            last_detail = last_block.detail()
        last_detail.update({'new_hash': get_hash(data)})
        Block.objects.create(previous_hash=last_hash, hash=get_hash(last_detail))

    @staticmethod
    def create_genesis_block():
        Block.create_block(0)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    user_type = models.TextField(default='Retailer')
    currency = models.FloatField(default=0)
    hash = models.TextField()

    USERNAME_FIELD = 'email'

    objects = UserManager()

    def detail(self):
        return {
            'email': self.email,
            'currency': self.currency,
            'user_type': self.user_type,
            'hash': self.hash
        }

    def add_asset(self, asset):
        asset = Asset(**asset)
        asset.owner = self
        asset.save()
        Block.create_block(asset.detail())

    def add_transaction(self, name, quantity, buyer):
        txn = Transaction(seller=self, buyer=User.objects.get(email=buyer))
        txn.create_transaction(name, quantity)


class Asset(models.Model):
    name = models.TextField()
    quantity = models.IntegerField()
    price = models.IntegerField()
    storage_period = models.IntegerField()
    season = models.TextField()
    owner = models.ForeignKey('User', related_name='assets', to_field='email', on_delete=models.CASCADE)

    objects = models.Manager()

    def detail(self):
        return {
            'name': self.name,
            'quantity': self.quantity,
            'price': self.price,
            'storage_period': self.storage_period,
            'season': self.season,
            'owner': self.owner.detail()
        }


class Transaction(models.Model):
    seller = models.ForeignKey('User', related_name='sold', to_field='email', on_delete=models.CASCADE)
    buyer = models.ForeignKey('User', related_name='bought', to_field='email', on_delete=models.CASCADE)
    asset = models.TextField()

    objects = models.Manager()

    def detail(self):
        return {
            'seller': self.seller.detail(),
            'buyer': self.buyer.detail(),
            'asset': json.loads(self.asset)
        }

    def create_transaction(self, name, quantity):
        if not self.seller.assets.filter(name=name).exists:
            return
        exchange = self.create_exchange(name, quantity)
        if isinstance(exchange, Asset):
            self.asset = json.dumps(self.update_balance(name, quantity, exchange))
            self.save()
            Block.create_block(self.detail())

    def create_exchange(self, name, quantity):
        if (self.seller.user_type == 'Warehouse' and self.buyer.user_type == 'Distributor') or (
                self.seller.user_type == 'Distributor' and self.buyer.user_type == 'Wholesale') or (
                self.seller.user_type == 'Wholesale' and self.buyer.user_type == 'Retailer'):
            assets = self.seller.assets
            try:
                if not assets.filter(name=name).exists():
                    return 'The seller doesn"t have this asset'
                asset = assets.get(name=name)
                if asset.quantity < quantity:
                    return 'The seller doesn"t have enough of this asset'
                if self.buyer.currency < quantity * asset.price:
                    return 'The buyer doesn"t have enough currency'
                if not self.buyer.assets.filter(name=name).exists():
                    return Asset(name=name, quantity=quantity, price=asset.price, storage_period=asset.storage_period,
                                 season=asset.season, owner=self.buyer)
                buyer_asset = self.buyer.assets.get(name=name)
                buyer_asset.quantity += quantity
                return buyer_asset
            except Exception as e:
                print(f'Create exchange error: {e}')
        else:
            return 'This exchange is not possible'

    def update_balance(self, name, quantity, update_obj):
        try:
            buyer = update_obj.owner
            asset = self.seller.assets.get(name=name)
            amount = quantity * asset.price
            buyer.currency -= amount
            self.seller.currency += amount
            asset.quantity -= quantity
            if not buyer.assets.filter(name=name).exists():
                update_obj.save()
                Block.create_block(update_obj.detail())
            asset.save()
            buyer.save()
            return update_obj
        except Exception as e:
            print(f'Update balance error: {e}')
