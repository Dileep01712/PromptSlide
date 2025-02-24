import os
import jwt
import datetime
from dotenv import load_dotenv
from passlib.hash import bcrypt
import requests as http_requests
from google.oauth2 import id_token
from google.auth.transport import requests
from fastapi import APIRouter, HTTPException, Body
from app.prisma_client import prisma, connect_to_db
from app.schemas.user_schema import LoginRequest, UserResponse

# Load environment variables
load_dotenv()

router = APIRouter()

# Google OAuth Configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_TOKEN_URL = os.getenv("GOOGLE_TOKEN_URL")

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET", "")  # Use a secure secret key
ALGORITHAM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # Token expiry time
REFRESH_TOKEN_EXPIRE_DAYS = 7


def create_jwt_token(data: dict, expires_delta: datetime.timedelta):
    """
    Generate JWT token with expiry.
    """
    payload = data.copy()
    expire = datetime.datetime.utcnow() + expires_delta
    payload.update({"exp": expire})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHAM)


# Normal Log in
@router.post("/login", response_model=UserResponse)
async def login_user(body: LoginRequest = Body(...)):
    """
    Handle normal user login
    """

    try:
        await connect_to_db()
        user = body.user

        # Check if user exists
        existing_user = await prisma.user.find_unique(where={"email": user.email})
        if not existing_user or not existing_user.password:
            raise HTTPException(status_code=400, detail="Invalid email or password.")

        # Verify password
        if not bcrypt.verify(user.password, existing_user.password):
            raise HTTPException(status_code=400, detail="Invalid email or password.")

        # Create JWT token
        # access_token = create_jwt_token(
        #     {"id": existing_user.id, "email": existing_user.email},
        #     datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        # )
        
        refresh_token = create_jwt_token(
            {"id": existing_user.id, "email": existing_user.email},
            datetime.timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        )

        # Return user data with token
        return {
            "id": existing_user.id,
            "firstName": existing_user.firstName,
            "lastName": existing_user.lastName,
            "email": existing_user.email,
            "refresh_token": refresh_token,
        }

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        print(f"Unexpected errro: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")


# Google Log in
@router.post("/login/google", response_model=UserResponse)
async def login_user_google(auth_code: str = Body(...), redirect_uri: str = Body(...)):
    """
    Handle Google OAuth login
    """

    try:
        # Ensure GOOGLE_TOKEN_URL is set
        if not GOOGLE_TOKEN_URL:
            raise HTTPException(
                status_code=500, detail="GOOGLE_TOKEN_URL is not configured."
            )

        token_response = http_requests.post(
            GOOGLE_TOKEN_URL,
            data={
                "code": auth_code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code",
            },
        )
        token_data = token_response.json()
        print(f"Token data: {token_data}")

        if "error" in token_data:
            raise HTTPException(
                status_code=400,
                detail=f"Error exchanging auth code: {token_data['error']}",
            )

        # Verify ID token
        id_token_str = token_data.get("id_token")
        if not id_token_str:
            raise HTTPException(
                status_code=400, detail="ID token is not found in response."
            )

        id_info = id_token.verify_oauth2_token(
            id_token_str, requests.Request(), GOOGLE_CLIENT_ID, clock_skew_in_seconds=10
        )

        email = id_info.get("email")

        # Check if user exists
        existing_user = await prisma.user.find_unique(where={"email": email})
        if not existing_user:
            raise HTTPException(
                status_code=404, detail="User not found. Please Sign Up first."
            )

        # Create JWT token
        # access_token = create_jwt_token(
        #     {"id": existing_user.id, "email": existing_user.email},
        #     datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        # )
        
        refresh_token = create_jwt_token(
            {"id": existing_user.id, "email": existing_user.email},
            datetime.timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        )
        # print("Access token: ", access_token)
        print("Refresh token: ", refresh_token)

        # Return user data with token
        return {
            "id": existing_user.id,
            "firstName": existing_user.firstName,
            "lastName": existing_user.lastName,
            "email": existing_user.email,
            "refresh_token": refresh_token,
        }

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpectd error occurred.")
