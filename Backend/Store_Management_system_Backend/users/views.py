from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password

import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth.hashers import check_password
from .models import UserRole

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    return Response({
        "username": user.username,
        "role": user.role,
    })


@api_view(['POST'])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"status": "error", "message": "Username and password required"}, status=400)

    try:
        print(f"Attempting to find user: {username}")
        user = User.objects(username=username).first()
        print(f"User found: {user}")
        
        if not user:
            return Response({"status": "error", "message": "User not found"}, status=401)
        
        print(f"Checking password for user: {user.username}")
        print(f"Stored password hash: {user.password}")
        print(f"Input password: {password}")
        
        # Check if password is hashed or plain text
        if user.password == password:  # Plain text comparison for testing
            print("Password matches (plain text)")
            password_valid = True
        else:
            try:
                password_valid = check_password(password, user.password)
                print(f"Password check result: {password_valid}")
            except Exception as e:
                print(f"Password check error: {e}")
                password_valid = False
        
        if password_valid:
            print(f"Getting role value for user: {user.username}")
            # Get the role value from the EnumField
            role_value = user.role.value if hasattr(user.role, 'value') else str(user.role)
            print(f"Role value: {role_value}")

            try:
                # Generate simple JWT tokens
                print("Generating JWT tokens...")
                
                # Create payload
                payload = {
                    'username': user.username,
                    'role': role_value,
                    'exp': datetime.utcnow() + timedelta(hours=24),
                    'iat': datetime.utcnow()
                }
                
                # Generate tokens (using a simple secret for now)
                secret = 'your-secret-key-here'
                access_token = jwt.encode(payload, secret, algorithm='HS256')
                refresh_token = jwt.encode({**payload, 'exp': datetime.utcnow() + timedelta(days=7)}, secret, algorithm='HS256')
                
                print("JWT tokens generated successfully")

                return Response({
                    "status": "success",
                    "full_name": user.full_name,
                    "username": user.username,
                    "role": role_value,
                    "access": access_token,
                    "refresh": refresh_token
                }, status=200)
            except Exception as e:
                print(f"JWT token generation error: {e}")
                return Response({"status": "error", "message": f"Token generation failed: {str(e)}"}, status=500)

        return Response({"status": "error", "message": "Invalid credentials"}, status=401)
        
    except Exception as e:
        print(f"Login error: {e}")
        import traceback
        traceback.print_exc()
        return Response({"status": "error", "message": f"Server error: {str(e)}"}, status=500)



# front should have logic to check if the user is logged in and is an admin
# if not, it should redirect to the login page
@api_view(['POST'])
def register_staff(request):
    full_name = request.data.get("full_name")
    username = request.data.get("username")
    role = request.data.get("role")
    password = request.data.get("password")
    confirm_password = request.data.get("confirm_password")
    if role == "Admin":
        return Response({"status": "error", "message": "Admin should be limited "}, status=403)
    if not all([full_name, username, role, password, confirm_password]):
        return Response({"status": "error", "message": "All fields are required"}, status=400)
    if password != confirm_password:
        return Response({"status": "error", "message": "Passwords do not match"}, status=400)
    # change to check password length to 8 after testing
    if len(password) < 2:
        return Response({"status": "error", "message": "Password must be at least 2 characters long"}, status=400)
    try:
        if User.objects(username=username).first():
            return Response({"status": "error", "message": "User already exists"}, status=400)
        else:
            # Convert string role to UserRole enum
            try:
                role_enum = UserRole(role)
            except ValueError:
                return Response({"status": "error", "message": f"Invalid role: {role}. Valid roles are: {[r.value for r in UserRole]}"}, status=400)
            
            user = User(
                full_name=full_name,
                username=username,
                role=role_enum,
                password=make_password(password),
                confirm_password=make_password(confirm_password)
            )
            user.clean()
            user.save()
            return Response({"status": "success", "message": "User registered successfully"}, status=201)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)



"""
Data will be like this 
{
    "username": "testuser",
    "old_password": "oldpassword",
    "new_password": "newpassword",
    "confirm_new_password": "newpassword"
}
"""
@api_view(['POST'])
def change_password(request):
    username = request.data.get("username")
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")
    confirm_new_password = request.data.get("confirm_new_password")
    if not all([username, old_password, new_password, confirm_new_password]):
        return Response({"status": "error", "message": "All fields are required"}, status=400)
    if new_password != confirm_new_password:
        return Response({"status": "error", "message": "New passwords do not match"}, status=400)
    if len(new_password) < 2:
        return Response({"status": "error", "message": "New password must be at least 2 characters long"}, status=400)
    try:
        user = User.objects(username=username).first()
        if not user or not check_password(old_password, user.password):
            return Response({"status": "error", "message": "Invalid username or password"}, status=401)
        user.password = make_password(new_password)
        user.confirm_password = make_password(confirm_new_password)
        user.clean()
        user.save()
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)
    return Response({"status": "success", "message": "User Password Changed successfully"}, status=200)


"""
data will be like this 
{
    "username": "testuser",
}
"""
@api_view(['POST'])
def delete_user(request):
    username = request.data.get("username")
    if not username:
        return Response({"status": "error", "message": "Username is required"}, status=400)
    try:
        user = User.objects(username=username).first()
        if not user:
            return Response({"status": "error", "message": "User not found"}, status=404)
        # Get the role value from the EnumField
        role_value = user.role.value if hasattr(user.role, 'value') else str(user.role)
        if role_value == "Admin":
            return Response({"status": "error", "message": "Cannot delete admin user"}, status=403)
        # Delete the user
        user.delete()
        return Response({"status": "success", "message": "User deleted successfully"}, status=200)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)

@api_view(['GET'])
def get_staff_data(request):
    try:
        staff_roles = ['Manager', 'Cashier', 'Inventory Manager']
        answer = []

        for role in staff_roles:
            user = User.objects(role=role).first()

            if user:
                user_data = {
                    "status": "success",
                    "full_name": user.full_name,
                    "username": user.username,
                    "role": role,
                }
            else:
                user_data = {
                    "status":"No user found",
                    "full_name": None,
                    "username": None,
                    "role": role,
                }

            answer.append(user_data)

        return Response({"status": "success", "data": answer}, status=200)

    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)
