from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import json
from typing import List, Dict
from schemas.compare import CVScore
import re

class CVComparator:
    def __init__(self):
        self.chain = self._create_chain()
    
    def _create_chain(self):
        prompt = ChatPromptTemplate.from_messages([
            ("system", 
             "You are an expert recruiter. Compare multiple CVs against job requirements and "
             "provide scores (0-100) with strengths/weaknesses. Return ONLY valid JSON with:\n"
             "- cv_text: The original CV text\n"
             "- score: Match score (0-100)\n"
             "- strengths: 3 key strengths\n"
             "- weaknesses: 3 key weaknesses\n\n"
             "Job Title: {job_title}\n"
             "Requirements: {job_requirements}\n"
             "Description: {job_description}"),
            ("human", "CVs to compare:\n{cv_texts}")
        ])
        
        model = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.3)
        return prompt | model | StrOutputParser()
    

    def extract_json_from_response(self, text: str) -> str:
        """
        Extract JSON array from model output string.
        Supports JSON inside triple backticks or plain JSON arrays.
        Raises ValueError if no JSON found.
        """
        # Try to find JSON inside triple backticks with 'json' label
        match = re.search(r"```json\s*(\[.*?\])\s*```", text, re.DOTALL)
        if match:
            return match.group(1)

        # Try to find any JSON array in the text
        match = re.search(r"(\[.*\])", text, re.DOTALL)
        if match:
            return match.group(1)

        raise ValueError("No JSON array found in model output")
    

    
    async def compare_cvs(self, cv_texts: List[str], job_title: str, 
                         job_requirements: str, job_description: str) -> List[CVScore]:
        try:
            result = await self.chain.ainvoke({
                "cv_texts": "\n\n---\n\n".join(cv_texts),
                "job_title": job_title,
                "job_requirements": job_requirements,
                "job_description": job_description
            })
            print("Raw model output:", repr(result))  # Debug: print raw output

            json_text = self.extract_json_from_response(result)
            parsed = json.loads(json_text)
            return [CVScore(**item) for item in parsed]
        except Exception as e:
            raise ValueError(f"Comparison failed: {str(e)}")