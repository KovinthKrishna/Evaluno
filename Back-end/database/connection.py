from pymongo import MongoClient
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str
    DATABASE_NAME: str = "fastapi_auth"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()

client = MongoClient(settings.DATABASE_URL)
db = client[settings.DATABASE_NAME]

def get_db():
    return db