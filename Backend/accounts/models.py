from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    USER_TYPES = [
        ('student', 'Student'),
        ('professional', 'Professional/Working'),
        ('job-seeker', 'Job Seeker'),
        ('freelancer', 'Freelancer'),
        ('recruiter', 'HR/Recruiter'),
        ('other', 'Other'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True, null=True)
    user_type = models.CharField(max_length=50, choices=USER_TYPES, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"
