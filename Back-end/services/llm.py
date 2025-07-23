from langchain_groq import ChatGroq
from dotenv import load_dotenv
from schemas.interview import ( InterviewQnARequest, InterviewQnAResponse)
from langchain.prompts import ( ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate)
from langchain_core.output_parsers import StrOutputParser
import os

load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")

parser = StrOutputParser()

model = ChatGroq(model="llama-3.3-70b-versatile") 


prompt = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template(
        "You are an expert recruiter and interviewer. "
        "Given a candidate’s CV, a job title, requirements, and description, "
        "generate a list of questions based on the project they are mentiond in CV. "
        "qutions are like scanario based with jop requirment tecnical and practicle , "
		"also include questions about the candidate's experience, skills, and how they relate to the job. "
        "For each question, provide a clear answer and assign a difficulty level (easy, medium, hard). "
        "and assign a difficulty level (easy, medium, hard). "
        "Return ONLY valid JSON matching this schema:\n\n"
        "[json(question: str, answer: str , difficulty: str)]"
    ),
    HumanMessagePromptTemplate.from_template(
        "CV Text:\n{cv_text}\n\n"
        "Job Title: {job_title}\n"
        "Requirements: {job_requirements}\n"
        "Description: {job_description}\n\n"
        "Generate the Q&A pairs now."
    ),
])

chain = prompt | model | parser