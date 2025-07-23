from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal



class UserBase(BaseModel):
    username: str
    email: EmailStr
    user_type: Literal["personal", "enterprise"]


class EnterpriseInfo(BaseModel):
    company_name: str
    company_category: str
    company_email: EmailStr


class UserCreate(UserBase):
    password: str
    enterprise_info: Optional[EnterpriseInfo] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: str
    enterprise_info: Optional[EnterpriseInfo]


# Optional: For use in database logic
class UserInDB(UserBase):
    id: Optional[str] = None
    password: str
    enterprise_info: Optional[EnterpriseInfo] = None
