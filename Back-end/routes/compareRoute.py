from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List
from services.compare_service import CVComparator
from schemas.compare import CVCompareRequest, CVCompareResponse
import json
import io
import traceback
from routes.interviewRoute import extract_text_from_pdf_bytes, extract_text_from_docx_bytes

router = APIRouter(prefix="/compare", tags=["CV Comparison"])
comparator = CVComparator()

@router.post("/", response_model=CVCompareResponse)
async def compare_cvs(request: CVCompareRequest):
    try:
        if not request.cv_texts:
            raise HTTPException(status_code=400, detail="No CV texts provided")
            
        comparisons = await comparator.compare_cvs(
            request.cv_texts,
            request.job_title,
            request.job_requirements,
            request.job_description
        )
        return {"comparisons": comparisons}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Comparison error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Comparison failed: {str(e)}")

@router.post("/upload")
async def compare_uploaded_cvs(
    cv_files: List[UploadFile] = File(...),
    job_title: str = Form(...),
    job_requirements: str = Form(...),
    job_description: str = Form(...)
):
    try:
        if not cv_files:
            raise HTTPException(status_code=400, detail="No CV files uploaded")

        cv_texts = []
        for file in cv_files:
            if not file.filename:
                continue
                
            file_bytes = await file.read()
            
            if file.filename.lower().endswith(".pdf"):
                text = extract_text_from_pdf_bytes(file_bytes)
            elif file.filename.lower().endswith(".docx"):
                text = extract_text_from_docx_bytes(file_bytes)
            else:
                continue
                
            if text:
                cv_texts.append(text)

        if not cv_texts:
            raise HTTPException(status_code=400, detail="No valid CV content found")

        comparisons = await comparator.compare_cvs(
            cv_texts,
            job_title,
            job_requirements,
            job_description
        )
        
        return {"comparisons": comparisons}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Upload comparison error: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500, 
            detail=f"CV comparison failed: {str(e)}"
        )