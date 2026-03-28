import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .utils import extract_text_from_pdf
from .services import get_analysis_response
from .models import ChatSession, ChatMessage
from django.contrib.auth import get_user_model

User = get_user_model()

@csrf_exempt
def get_sessions_view(request):
    """Returns a list of all chat sessions for the user."""
    # Auth Bypass matching analyze_resume_view
    user = request.user if request.user.is_authenticated else User.objects.first()
    if not user:
        return JsonResponse({'error': 'Authentication required'}, status=401)
        
    sessions = ChatSession.objects.filter(user=user).order_by('-created_at')
    
    response_data = []
    for session in sessions:
        # Get the first user message or just say "New Chat" if empty. Or if PDF exists "Resume Chat"
        first_msg = session.messages.filter(role='user').first()
        title = first_msg.content[:40] + "..." if first_msg else ("Resume Chat" if session.resume_pdf else "New Chat")
        
        response_data.append({
            'id': session.id,
            'title': title,
            'has_resume': bool(session.resume_pdf),
            'created_at': session.created_at.isoformat()
        })
        
    return JsonResponse({'sessions': response_data}, status=200)

@csrf_exempt
def get_session_details_view(request, session_id):
    """Returns the full chat history of a specific session."""
    user = request.user if request.user.is_authenticated else User.objects.first()
    
    try:
        session = ChatSession.objects.get(id=session_id, user=user)
        history = []
        for msg in session.messages.all().order_by('timestamp'):
            history.append({
                'id': msg.id,
                'role': msg.role,
                'content': msg.content,
                'timestamp': msg.timestamp.isoformat()
            })
        return JsonResponse({'session_id': session.id, 'messages': history}, status=200)
    except ChatSession.DoesNotExist:
        return JsonResponse({'error': 'Session not found'}, status=404)

@csrf_exempt
def analyze_resume_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)
    
    user = request.user if request.user.is_authenticated else User.objects.first()

    try:
        resume_file = request.FILES.get('resume')
        message = request.POST.get('message', '')
        session_id = request.POST.get('session_id')

        # Mode 1: Initialization (Upload PDF)
        if resume_file:
            session = ChatSession.objects.create(
                user=user,
                resume_pdf=resume_file
            )
            initial_msg = "I have successfully processed your resume. Please enter the job description you are applying for."
            ChatMessage.objects.create(session=session, role='assistant', content=initial_msg)
            
            return JsonResponse({
                'session_id': session.id,
                'analysis': initial_msg
            })

        # Mode 2: Chatting (Message + session_id)
        if session_id and message:
            try:
                session = ChatSession.objects.get(id=session_id)
            except ChatSession.DoesNotExist:
                return JsonResponse({'error': 'Invalid Session ID'}, status=404)

            # Extract text ONLY if a resume exists
            resume_text = extract_text_from_pdf(session.resume_pdf) if session.resume_pdf else None

            # Get history (excluding the new message)
            history = [{'role': msg.role, 'content': msg.content} for msg in session.messages.all().order_by('timestamp')]

            # Save the new user message
            ChatMessage.objects.create(session=session, role='user', content=message)
            
            # AI Processing
            ai_response = get_analysis_response(resume_text, message, history)

            # Save assistant response
            ChatMessage.objects.create(session=session, role='assistant', content=ai_response)

            return JsonResponse({
                'session_id': session.id,
                'analysis': ai_response
            })

        # Mode 3: Generic Chat (Message, NO session_id, NO resume)
        if message and not session_id and not resume_file:
            session = ChatSession.objects.create(
                user=user,
                resume_pdf=None
            )
            ChatMessage.objects.create(session=session, role='user', content=message)
            
            ai_response = get_analysis_response(None, message, [])
            
            ChatMessage.objects.create(session=session, role='assistant', content=ai_response)
            
            return JsonResponse({
                'session_id': session.id,
                'analysis': ai_response
            })

        return JsonResponse({'error': 'Invalid request parameters'}, status=400)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
