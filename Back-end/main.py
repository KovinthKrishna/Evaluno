from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routes import auth
from routes import interviewRoute
from database.connection import get_db, client
from pymongo.errors import ConnectionFailure
from routes import compareRoute


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(interviewRoute.router)
app.include_router(compareRoute.router)


# Optional: Root route
@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI authentication service"}

# Optional: DB connection test
@app.get("/check-db")
async def check_db_connection():
    try:
        await client.admin.command('ping')
        return {"status": "success", "message": "Connected to MongoDB Atlas!"}
    except ConnectionFailure as e:
        raise HTTPException(status_code=500, detail=f"Failed to connect to MongoDB: {str(e)}")
