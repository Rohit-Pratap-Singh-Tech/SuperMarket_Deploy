from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),    
    path('api/', include('api.urls')),
    path('login/', views.login_user, name='login'),
    path('register/', views.register_staff, name='register'),
    path('password/change/', views.change_password, name='change_password'),
    path('delete/', views.delete_user, name='delete_user'),
    path('staffData/',views.get_staff_data,name='staffData')
]