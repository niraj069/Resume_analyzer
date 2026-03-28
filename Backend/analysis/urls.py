from django.urls import path
from .views import analyze_resume_view, get_sessions_view, get_session_details_view

urlpatterns = [
    path('analyze/', analyze_resume_view, name='analyze_resume'), 
    path('sessions/', get_sessions_view, name='get_sessions'),
    path('sessions/<int:session_id>/', get_session_details_view, name='get_session_details'),
]
