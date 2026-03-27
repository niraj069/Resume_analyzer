import json
from django.contrib.auth import authenticate, get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Profile

User = get_user_model()

@csrf_exempt
def register_user(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        payload = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    name = payload.get('name')
    email = payload.get('email')
    password = payload.get('password')
    phone = payload.get('phone')
    user_type = payload.get('userType') # Frontend sends userType

    if not email or not password:
        return JsonResponse({'error': 'Email and password are required'}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'Email already registered'}, status=400)

    try:
        # Django User model doesn't have email as unique by default in base User, 
        # but we use it as username here for simplicity as the project did.
        user = User.objects.create_user(
            username=email, 
            email=email, 
            password=password, 
            first_name=(name or '')
        )
        
        # Create Profile
        Profile.objects.create(
            user=user,
            phone=phone,
            user_type=user_type
        )
        
        return JsonResponse({'message': 'User registered', 'token': 'fake-jwt-token'}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def login_user(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        payload = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    email = payload.get('email')
    password = payload.get('password')

    if not email or not password:
        return JsonResponse({'error': 'Email and password are required'}, status=400)

    # Note: we used email as username in register_user
    user = authenticate(request, username=email, password=password)

    if user is None:
        return JsonResponse({'error': 'Invalid credentials'}, status=401)
    
    return JsonResponse({'message': 'Login successful', 'token': 'fake-jwt-token'}, status=200)

