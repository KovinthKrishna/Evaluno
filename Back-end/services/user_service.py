# Add this at the VERY TOP of user_service.py (before other imports)
import bcrypt
bcrypt.__about__ = type('obj', (), {'__version__': '4.3.0'})  # Manually add missing attribute

# Now import passlib
from passlib.context import CryptContext

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import HTTPException, status

from database.connection import get_db, user_collection  # merged both imports
from schemas.user import UserCreate, UserInDB, UserResponse, UserLogin
from utils.helpers import hash_password, verify_password, create_access_token
from bson import ObjectId
import secrets

# Replace the existing pwd_context line with:
pwd_context = CryptContext(
    schemes=["bcrypt"], 
    bcrypt__ident="2b",  # Force modern bcrypt variant
    bcrypt__rounds=12,   # Standard number of rounds
    deprecated="auto"
)

db = get_db()
users_collection = db["users"]  # to use in functions

# Async functions

async def create_user(user: UserCreate):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_dict = user.dict()
    user_dict["password"] = hash_password(user.password)

    result = await users_collection.insert_one(user_dict)
    return str(result.inserted_id)


async def authenticate_user(data: UserLogin):
    user = await users_collection.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": user["email"],
        "username": user["username"],
        "user_type": user["user_type"],
        "user_id": str(user["_id"])  
    })

    return token
