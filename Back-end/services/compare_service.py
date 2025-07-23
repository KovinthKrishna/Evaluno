from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import json
from typing import List
from schemas.compare import CVScore
import re

class CVComparator:
    def __init__(self):
        self.chain = self._create_chain()

    def _create_chain(self):
        prompt = ChatPromptTemplate.from_messages([
            ("system", 
             "You are an expert recruiter. Compare multiple CVs against job requirements and "
             "provide scores (0-100) with strengths/weaknesses. Return ONLY a single JSON array, where each item contains:\n"
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

    def extract_json_objects(self, text: str) -> List[dict]:
        """
        Extracts JSON objects from LLM output.
        Handles both a single JSON array or multiple objects inside a markdown block.
        """
        # Try to extract a full JSON array first
        array_match = re.search(r"\[\s*{.*?}\s*]", text, re.DOTALL)
        if array_match:
            try:
                return json.loads(array_match.group(0))
            except json.JSONDecodeError:
                pass  # Fallback to individual object parsing

        # Fallback: extract markdown JSON block
        block_match = re.search(r"```json\s*(.*?)\s*```", text, re.DOTALL)
        if not block_match:
            raise ValueError("No JSON block found in model output")

        json_block = block_match.group(1)

        # Extract individual objects from the block
        object_strings = re.findall(r'{[^{}]*?(?:(?R)|[^{}])*}', json_block, re.DOTALL)
        parsed = []
        for obj_str in object_strings:
            try:
                parsed_obj = json.loads(obj_str)
                parsed.append(parsed_obj)
            except json.JSONDecodeError:
                print(f"⚠️ Failed to decode block: {obj_str[:100]}...")
                continue

        if not parsed:
            raise ValueError("All extracted blocks failed to parse as JSON")

        return parsed

    async def compare_cvs(
        self, 
        cv_texts: List[str], 
        job_title: str, 
        job_requirements: str, 
        job_description: str
    ) -> List[CVScore]:
        try:
            result = await self.chain.ainvoke({
                "cv_texts": "\n\n---\n\n".join(cv_texts),
                "job_title": job_title,
                "job_requirements": job_requirements,
                "job_description": job_description
            })

            print("Raw model output:", repr(result))  # Debug: Show full output

            parsed_objects = self.extract_json_objects(result)
            return [CVScore(**obj) for obj in parsed_objects]

        except Exception as e:
            raise ValueError(f"Comparison failed: {str(e)}")
