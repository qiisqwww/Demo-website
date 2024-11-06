from typing import Optional, Self

from pydantic import BaseModel, EmailStr, Field

from src.models import User

__all__ = [
    "UserReturnData"
]


class UserReturnData(BaseModel):
    username: str = Field(min_length=3, max_length=255)
    email: EmailStr = Field(min_length=3, max_length=320)

    @classmethod
    def from_user(cls, user: User) -> Self:
        return UserReturnData(
            username=user.username,
            email=user.email,
            is_active=user.is_active,
            is_superuser=user.is_superuser,
            is_verified=user.is_verified
        )
