import os
import django
from django.contrib.auth.hashers import make_password

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Store_Management_system_Backend.settings")
django.setup()

from users.models import User, UserRole

def create_test_user():
    try:
        # Check if user already exists
        existing_user = User.objects(username="admin").first()
        if existing_user:
            print(f"User 'admin' already exists with role: {existing_user.role}")
            return existing_user
        
        # Create a new admin user
        user = User(
            full_name="Administrator",
            username="admin",
            role=UserRole.ADMIN,
            password=make_password("admin123"),
            confirm_password=make_password("admin123")
        )
        user.save()
        print(f"Created user: {user.username} with role: {user.role}")
        return user
    
    except Exception as e:
        print(f"Error creating user: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    print("Creating test user...")
    user = create_test_user()
    if user:
        print("Test user created successfully!")
        print(f"Username: {user.username}")
        print(f"Password: admin123")
        print(f"Role: {user.role}")
    else:
        print("Failed to create test user.")
