import os
import django
from django.contrib.auth.hashers import make_password

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Store_Management_system_Backend.settings")
django.setup()

# Change this to your plain password
plain_password = "admin123"

hashed = make_password(plain_password)
print("Hashed password:", hashed)
