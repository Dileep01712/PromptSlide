# type:ignore
import os
from fastapi import FastAPI, HTTPException
from app.routers import user_input, register
from fastapi.middleware.cors import CORSMiddleware
from app.prisma_client import connect_to_db, disconnect_from_db

# Create the FastAPI app instance
app = FastAPI(
    title="PromptSlide API",
    description="An API for generating and editing PowerPoint presentations.",
    version="1.0.0",
)

# Get frontend URLs from environment variables (default to localhost for development)
FRONTEND_URLS = os.getenv(
    "FRONTEND_URLS", "http://localhost:5173,https://promptslide.vercel.app"
)
frontend_urls = [
    url.strip() for url in FRONTEND_URLS.split(",") if url.strip()
]  # Split to allow multiple origins

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_urls,  # Allow frontend requests dynamically
    allow_credentials=True,  # Allow cookies or credentials if needed
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Register all routers
app.include_router(register.router, prefix="/api/user", tags=["New User"])
app.include_router(user_input.router, prefix="/api/user", tags=["User Input"])


@app.on_event("startup")
async def on_startup():
    # Connect to the database when application starts
    try:
        await connect_to_db()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {e}")


@app.on_event("shutdown")
async def on_shutdown():
    # Disconnect from the database when the application shuts down
    try:
        await disconnect_from_db()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Database disconnection failed: {e}"
        )


@app.get("/")
async def root():
    return {"message": "Welcome to the PromptSlide API"}
