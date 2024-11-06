from typing import Optional
from datetime import datetime, date

from pydantic import BaseModel, EmailStr, Field, field_validator

__all__ = [
    "UserInputData"
]


class UserInputData(BaseModel):
    username: str = Field(min_length=3, max_length=255)
    email: EmailStr = Field(min_length=3, max_length=320)
    birthdate: date
    password: str
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False
    is_verified: Optional[bool] = False

    @field_validator("birthdate", mode="before")
    def parse_birthdate(cls, value):
        try:
            return datetime.strptime(value, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("Date format must be DD.MM.YYYY")
