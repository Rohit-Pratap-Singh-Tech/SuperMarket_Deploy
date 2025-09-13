#!/usr/bin/env python
import os
import sys
import django
from pathlib import Path

# Add the project directory to Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Store_Management_system_Backend.settings')
django.setup()

# Now test MongoDB connection
import mongoengine

print("Testing MongoDB connection...")
print(f"MONGO_URI from env: {os.getenv('MONGO_URI', 'mongodb://localhost:27017/Store_Management_System')}")

try:
    mongoengine.connect(
        db="Store_Management_System",
        host="mongodb://localhost:27017/Store_Management_System"
    )
    print("✅ MongoDB connection successful!")
    
    # Test a simple query
    from users.models import User
    user_count = User.objects.count()
    print(f"✅ User count: {user_count}")
    
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    import traceback
    traceback.print_exc()
