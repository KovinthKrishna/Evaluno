from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
import certifi

# Load environment variables
load_dotenv()

# Get Mongo URI from .env file
MONGO_URI = os.getenv("MONGO_URI")

# Create async MongoDB client
client = AsyncIOMotorClient(
    MONGO_URI,
    tls=True,
    tlsCAFile=certifi.where(),
    connectTimeoutMS=30000,
    serverSelectionTimeoutMS=30000
)

# Access the database and collections
db = client["evaluno_db"]
user_collection = db["users"]
cv_results = db["CVResult"]

def get_db():
    return db
