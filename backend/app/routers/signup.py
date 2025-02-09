import os
from dotenv import load_dotenv
from passlib.hash import bcrypt
import requests as http_requests
from google.oauth2 import id_token
from google.auth.transport import requests
from fastapi import APIRouter, HTTPException, Body
from app.prisma_client import prisma, connect_to_db
from app.schemas.user_schema import SignupRequest, UserResponse

load_dotenv()

router = APIRouter()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_TOKEN_URL = os.getenv("GOOGLE_TOKEN_URL")


# Normal Sign up
@router.post("/signup", response_model=UserResponse)
async def register_user(
    body: SignupRequest = Body(...),
):
    """
    Handles normal user registration.
    """
    try:
        # Connect to the database
        await connect_to_db()
        user = body.user
        print(f"User data: {user}")

        # Check if the email already exists
        existing_user = await prisma.user.find_unique(where={"email": user.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already exists.")

        # Hash the password
        hashed_password = bcrypt.hash(user.password)

        # Create the user in the database
        new_user = await prisma.user.create(
            data={
                "firstName": user.firstName,
                "lastName": user.lastName,
                "email": user.email,
                "password": hashed_password,
            }
        )

        # Return the created user
        return UserResponse(
            id=new_user.id,
            firstName=new_user.firstName,
            lastName=new_user.lastName,
            email=new_user.email,
        )

    except HTTPException as http_exc:
        raise http_exc  # Re-raise known HTTP exceptions

    except Exception as e:
        # Log the unexpected error details
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again later.",
        )


# Google Sign up
@router.post("/signup/google", response_model=UserResponse)
async def register_user_google(
    auth_code: str = Body(...), redirect_uri: str = Body(...)
):
    try:
        # Ensure GOOGLE_TOKEN_URL is set
        if not GOOGLE_TOKEN_URL:
            raise HTTPException(
                status_code=500, detail="GOOGLE_TOKEN_URL is not configured."
            )

        # Exchange the auth code for tokens
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
                status_code=400, detail="ID token not found in response."
            )

        id_info = id_token.verify_oauth2_token(
            id_token_str, requests.Request(), GOOGLE_CLIENT_ID, clock_skew_in_seconds=10
        )

        email = id_info.get("email")
        first_name = id_info.get("given_name")
        last_name = id_info.get("family_name", "NoLastName")

        # Check if email already exists
        existing_user = await prisma.user.find_unique(where={"email": email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already exists.")

        # Create user in the database
        new_user = await prisma.user.create(
            data={
                "firstName": first_name,
                "lastName": last_name,
                "email": email,
                "password": None,  # No password for Google sign-up
            }
        )

        return UserResponse(
            id=new_user.id,
            firstName=new_user.firstName,
            lastName=new_user.lastName,
            email=new_user.email,
        )

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")
