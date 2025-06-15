from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import certifi

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

# Create async MongoDB client
client = AsyncIOMotorClient(
    settings.DATABASE_URL,
    tls=True,
    tlsCAFile=certifi.where(),
    connectTimeoutMS=30000,
    serverSelectionTimeoutMS=30000
)

def get_db():
    return client[settings.DATABASE_NAME]