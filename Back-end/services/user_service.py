# Add this at the VERY TOP of user_service.py (before other imports)
import bcrypt
bcrypt.__about__ = type('obj', (), {'__version__': '4.3.0'})  # Manually add missing attribute

# Now import passlib
from passlib.context import CryptContext

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
from database.connection import settings, get_db
from schemas.user import UserCreate, UserInDB, UserResponse, TokenData
#from models.user import create_user_model
import secrets

# Replace the existing pwd_context line with:
pwd_context = CryptContext(
    schemes=["bcrypt"], 
    bcrypt__ident="2b",  # Force modern bcrypt variant
    bcrypt__rounds=12,   # Standard number of rounds
    deprecated="auto"
)
db = get_db()
users_collection = db["users"]

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def create_user(user: UserCreate) -> UserResponse:
    existing_user = await users_collection.find_one({"$or": [{"email": user.email}, {"username": user.username}]})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    db_user = {
        "username": user.username,
        "email": user.email,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await users_collection.insert_one(db_user)
    db_user["id"] = str(result.inserted_id)
    return UserResponse(**db_user)

async def authenticate_user(username: str, password: str):
    user = await users_collection.find_one({"username": username})
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user

async def get_current_user(token: str):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    user = await users_collection.find_one({"username": token_data.username})
    if user is None:
        raise credentials_exception
    return user