from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router

from fastapi import FastAPI, HTTPException
from database.connection import get_db, client
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI authentication service"}

@app.get("/check-db")
async def check_db_connection():
    try:
        # Ping the database (async)
        await client.admin.command('ping')
        return {"status": "success", "message": "Connected to MongoDB Atlas!"}
    except ConnectionFailure as e:
        raise HTTPException(status_code=500, detail=f"Failed to connect to MongoDB: {str(e)}")