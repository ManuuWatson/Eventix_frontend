# backend/settings.py
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY SETTINGS
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-dev-key-change-me')
DEBUG = os.getenv('DJANGO_DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# APPLICATIONS
INSTALLED_APPS = [
    # Django
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',

    # Local apps
    'users',
    'events',        # ✅ corrected name from 'eve' to 'events'
    'bookings',
    'payments',
]

# MIDDLEWARE
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',

    # corsheaders must be high in the stack
    'corsheaders.middleware.CorsMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

# TEMPLATES
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# DATABASE CONFIG (PostgreSQL)
DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE', 'django.db.backends.postgresql'),
        'NAME': os.getenv('POSTGRES_DB', 'ticket_booking_db'),
        'USER': os.getenv('POSTGRES_USER', 'ticket_booking'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'ticket_booking'),
        'HOST': os.getenv('POSTGRES_HOST', 'localhost'),
        'PORT': os.getenv('POSTGRES_PORT', '5432'),
    }
}

# AUTH VALIDATORS
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# INTERNATIONALIZATION
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Nairobi'
USE_I18N = True
USE_TZ = True

# STATIC & MEDIA FILES
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'static'
]

# ✅ For event posters and user uploads
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CUSTOM USER MODEL
AUTH_USER_MODEL = 'users.User'

# DJANGO REST FRAMEWORK CONFIG
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
}

# CORS SETTINGS (Development)
CORS_ALLOW_ALL_ORIGINS = True

# EMAIL (local)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
