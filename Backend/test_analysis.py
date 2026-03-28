import os
import django
from dotenv import load_dotenv

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'resume_analyzer.settings')
django.setup()

from analysis.services import analyze_resume

def test():
    print("--- Starting Resume Analysis Test ---")
    resume = """
    John Doe
    Full Stack Developer
    5 years experience in Python, Django, and React.
    Developed multiple e-commerce platforms.
    Expertise in SQL and NoSQL databases.
    """
    
    jd = "Seeking a Senior Python Developer with deep Django knowledge."
    
    print(f"Analyzing Resume for JD: {jd}")
    results = analyze_resume(resume, jd)
    
    import json
    print(json.dumps(results, indent=4))
    print("--- Test Completed Successfully ---")

if __name__ == "__main__":
    test()
