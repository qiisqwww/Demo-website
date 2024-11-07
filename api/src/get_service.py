from sqlalchemy.orm import Session
from fastapi import Depends

from src.database import get_session
from src.repositories.user_repository import UserRepository
from src.services import UserService, AuthService

__all__ = [
    "get_user_service",
    "get_auth_service",
]


def get_user_service(session: Session = Depends(get_session)) -> UserService:
    return UserService(UserRepository(session=session))


def get_auth_service(session: Session = Depends(get_session)) -> AuthService:
    return AuthService(UserRepository(session=session))
