import os
import jwt
from app.prisma_client import prisma, connect_to_db
from fastapi import APIRouter, HTTPException, Header
from app.schemas.user_schema import UserDetailsResponse

router = APIRouter()

# Retrieve your secret key and algorithm from environment or configuration.
SECRET_KEY = os.getenv("JWT_SECRET", "")
ALGORITHAM = "HS256"


@router.get("/details", response_model=UserDetailsResponse)
async def get_user_details(authorization: str = Header(...)):
    """
    Fetches the user details (firstName and email) for the authenticated user.
    Expects the Authorization header in the format: "Bearer <token>"
    """
    try:
        # Extract token from the Authorization header (expected format: "Bearer <token>")
        token_parts = authorization.split(" ")
        if len(token_parts) != 2 or token_parts[0] != "Bearer":
            raise HTTPException(
                status_code=400, detail="Invalid authorization header format."
            )
        token = token_parts[1]

        # Decode the JWT token to extract user information (like the user's id)
        try:
            decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHAM])
        except Exception as e:
            raise HTTPException(status_code=401, detail="Invalid token.")

        user_id = decoded_token.get("id")
        if not user_id:
            raise HTTPException(status_code=400, detail="Token missing user id.")

        # Connect to the database
        await connect_to_db()

        # Fetch the user using the decoded user_id
        user = await prisma.user.find_unique(where={"id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")

        # Return only the firstName and email
        return UserDetailsResponse(firstName=user.firstName, email=user.email)
    except HTTPException as http_exc:
        raise http_exc  # Re-raise known HTTP exceptions
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again later.",
        )
