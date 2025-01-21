from pydantic import BaseModel, EmailStr


# Schema for normal form signup
class NormalSignup(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    user: NormalSignup


# Schema for Google signup
class GoogleSignup(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr  # Mandatory for Google signup


# Schema for user response
class UserResponse(BaseModel):
    id: str
    firstName: str
    lastName: str
    email: EmailStr

    # Allows Pydantic to map database attributes to the response schema
    class Config:
        from_attributes = True
