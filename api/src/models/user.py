from datetime import date

from sqlalchemy import Column, String, Integer, Boolean, Date

from src.models.declarative_base import Base

__all__ = [
    "User"
]


class User(Base):
    __tablename__ = "users"

    id: int = Column(Integer, primary_key=True, unique=True)  # type: ignore
    username: str = Column(String(length=255), nullable=False)
    email: str = Column(String(length=320), nullable=False)  # type: ignore
    birthdate: date = Column(Date, nullable=False)
    photo_url: str = Column(String(length=255), server_default="/images/default.svg", nullable=False)
    hashed_password: str = Column(String(length=1024), nullable=False)  # type: ignore
    is_active = Column(Boolean, server_default='true', nullable=False)  # type: ignore
    is_superuser = Column(Boolean, server_default='false', nullable=False)  # type: ignore
    is_verified = Column(Boolean, server_default='false', nullable=False)  # type: ignore
