from pydantic import BaseModel, EmailStr


# Schema for normal form signup
class Signup(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str


class SignupRequest(BaseModel):
    user: Signup


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


class Login(BaseModel):
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    user: Login
