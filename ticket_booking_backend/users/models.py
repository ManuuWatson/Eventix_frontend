from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None, user_type='user', **extra_fields):
        if not email:
            raise ValueError('The Email field is required')
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, user_type=user_type, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, full_name, password, user_type='host', **extra_fields)


class User(AbstractUser):
    USER_TYPES = (
        ('user', 'User'),
        ('host', 'Host'),
    )

    username = None  # Disable username
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default='user')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    objects = UserManager()

    def __str__(self):
        return self.email
