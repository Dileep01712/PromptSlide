from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.prisma_client import connect_to_db, disconnect_from_db
from app.routers import user_input, signup, login, user_details, send_ppt


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
    allow_origins=["http://localhost:5173"],  # Frontend origin
    allow_credentials=True,  # Allow cookies or credentials if needed
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
    expose_headers=["Content-Disposition"],  # Expose the header to the frontend
)

# Register all routers
app.include_router(signup.router, prefix="/api/user", tags=["Sign up"])
app.include_router(login.router, prefix="/api/user", tags=["Log in"])
app.include_router(user_input.router, prefix="/api/user", tags=["User Input"])
app.include_router(send_ppt.router, prefix="/api/user", tags=["PPT File"])
app.include_router(user_details.router, prefix="/api/user", tags=["User"])


@app.get("/")
async def root():
    return {
        "message": "PromptSlide Backend API is running!!",
        "docs": "/docs",
    }
