import os
import uvicorn
from fastapi import FastAPI, HTTPException
from app.routers import user_input, register
from fastapi.middleware.cors import CORSMiddleware
from app.prisma_client import connect_to_db, disconnect_from_db
from contextlib import asynccontextmanager

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
    yield
    try:
        await disconnect_from_db()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Database disconnection failed: {e}"
        )


app = FastAPI(
    title="PromptSlide API",
    description="An API for generating and editing PowerPoint presentations.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_urls,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(register.router, prefix="/api/user", tags=["New User"])
app.include_router(user_input.router, prefix="/api/user", tags=["User Input"])


@app.get("/")
async def root():
    return {"message": "Welcome to the PromptSlide API"}


# Ensure Render sets the port dynamically
PORT = int(os.getenv("PORT", 10000))  # Render automatically sets the PORT variable


# Use the correct syntax to bind the app in Render
def start():
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)


if __name__ == "__main__":
    start()
