from django.urls import path
from . import views

urlpatterns = [
    path('assistant/', views.assistant, name='ai_assistant')
]
