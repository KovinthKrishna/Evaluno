from pydantic import BaseModel
from typing import List

class CVCompareRequest(BaseModel):
    cv_texts: List[str]  # List of CV texts to compare
    job_title: str
    job_requirements: str
    job_description: str

class CVScore(BaseModel):
    cv_text: str
    score: float
    strengths: List[str]
    weaknesses: List[str]

class CVCompareResponse(BaseModel):
    comparisons: List[CVScore]