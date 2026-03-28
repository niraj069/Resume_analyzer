import os
from groq import Groq
from django.conf import settings
import json

def get_analysis_response(resume_text, current_message, conversation_history):
    """
    Handles ATS scoring and conversational answering.
    """
    client = Groq(api_key=settings.GROQ_API_KEY)
    
    if resume_text:
        system_prompt = f"""
        You are an expert ATS Resume Analyzer and Career Coach.
        You have access to the user's resume content below.
        
        RESUME:
        {resume_text}
        
        RULES:
        1. If the user provides a Job Description, you MUST calculate an ATS Score (0-100), list missing keywords, and provide actionable suggestions.
        2. If the user asks a general question, answer it directly using their resume context. If they haven't provided a Job Description yet, gently remind them to provide one so you can calculate an ATS score.
        3. Be professional, highly technical, and supportive.
        4. Format your response cleanly. Use markdown if helpful, but keep it readable as a chat message.
        """
    else:
        system_prompt = """
        You are an expert AI Career Coach. 
        The user has NOT uploaded a resume, so this is a generic chat about career advice, projects, or job descriptions.
        
        RULES:
        1. Give specific, technical, and actionable career/interview/project advice based on the user's queries.
        2. Provide brilliant ideas for projects or skills if they ask.
        3. Be highly supportive and professional.
        4. Do NOT ask for a resume unless the user wants an ATS score.
        """
    
    messages = [
        {"role": "system", "content": system_prompt}
    ]
    
    # Add history
    for msg in conversation_history:
        messages.append({"role": msg['role'], "content": msg['content']})
        
    # Add current user message
    messages.append({"role": "user", "content": current_message})
        
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
    )
    
    return completion.choices[0].message.content
