from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer, LoginSerializer


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                "success": True,
                "message": "Registration successful. You can now log in.",
                "user": {
                    "email": user.email,
                    "full_name": user.full_name,
                    "user_type": user.user_type,
                },
                "token": token.key,
                "redirect_to": "/login"
            }, status=status.HTTP_201_CREATED)

        # Debugging output for backend logs
        print("🔍 Registration Validation Errors:", serializer.errors)

        # Generate user-friendly error message
        error_message = "Registration failed. Please check your input."
        if "password" in serializer.errors:
            error_message = "Password must be at least 6 characters long."
        elif "email" in serializer.errors:
            error_message = "Please provide a valid email address."
        elif "full_name" in serializer.errors:
            error_message = "Please provide your full name."

        return Response({
            "success": False,
            "message": error_message,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


# users/views.py
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)

            # ✅ Use frontend routes here
            if user.user_type == "host":
                redirect_url = "/host"
            elif user.user_type == "admin":
                redirect_url = "/admin"
            else:
                redirect_url = "/"

            return Response({
                "success": True,
                "message": "Login successful.",
                "token": token.key,
                "user": {
                    "email": user.email,
                    "full_name": user.full_name,
                    "user_type": user.user_type,
                },
                "redirect_to": redirect_url
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "message": "Login failed. Invalid credentials.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
