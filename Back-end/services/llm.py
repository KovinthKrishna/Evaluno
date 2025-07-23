from langchain_groq import ChatGroq
from dotenv import load_dotenv
from schemas.interview import ( InterviewQnARequest, InterviewQnAResponse)
from langchain.prompts import ( ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate)
from langchain_core.output_parsers import StrOutputParser
import os
import json

load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")

parser = StrOutputParser()

model = ChatGroq(model="llama-3.3-70b-versatile") 


prompt = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template(
         "You are a senior technical recruiter and interviewer with deep industry experience.\n"
        "Given the candidate's CV, job title, job requirements, and job description:\n"
        "- Generate 8–12 interview questions relevant to the job.\n"
        "- Include a mix of scenario-based, behavioral, and project-specific questions.\n"
        "- Each item must include:\n"
        "    • 'question': A clearly phrased question\n"
        "    • 'answer': A plausible answer\n"
        "    • 'type': one of ['technical', 'behavioral', 'project','scenario']\n"
        "    • 'difficulty': one of ['easy', 'medium', 'hard']\n\n"
        "Return ONLY valid JSON array like:\n"
        "[{{\"question\": str, \"answer\": str, \"type\": str, \"difficulty\": str}}]"
    ),
    HumanMessagePromptTemplate.from_template(
       "CV Text:\n{cv_text}\n\n"
        "Job Title: {job_title}\n"
        "Requirements: {job_requirements}\n"
        "Description: {job_description}\n\n"
        "Generate the Q&A set now."
    
    ),
])

chain = prompt | model | parser



