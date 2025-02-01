import os
import uvicorn
from fastapi import FastAPI, HTTPException
from app.routers import user_input, register
from fastapi.middleware.cors import CORSMiddleware
from app.prisma_client import connect_to_db, disconnect_from_db
from contextlib import asynccontextmanager

# Get frontend URLs from environment variables (default to localhost for development)
FRONTEND_URLS = os.getenv(
    "FRONTEND_URLS", "http://localhost:5173,https://promptslide.vercel.app"
)
frontend_urls = [url.strip() for url in FRONTEND_URLS.split(",") if url.strip()]


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await connect_to_db()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {e}")

    yield  # Run the app while active

    try:
        await disconnect_from_db()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Database disconnection failed: {e}"
        )


# Create the FastAPI app instance
app = FastAPI(
    title="PromptSlide API",
    description="An API for generating and editing PowerPoint presentations.",
    version="1.0.0",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_urls,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(register.router, prefix="/api/user", tags=["New User"])
app.include_router(user_input.router, prefix="/api/user", tags=["User Input"])


@app.get("/")
async def root():
    return {"message": "Welcome to the PromptSlide API"}


# Get port dynamically from Render, default to 8000 locally
PORT = int(os.getenv("PORT", 8000))

# Ensure FastAPI runs on the correct port
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)
