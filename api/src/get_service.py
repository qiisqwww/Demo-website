from sqlalchemy.orm import Session
from fastapi import Depends

from src.database import get_session
from src.repositories.impls import UserRepository, RefillRepository, RefillRentRepository
from src.services import UserService, AuthService, RefillService

__all__ = [
    "get_user_service",
    "get_auth_service",
    "get_refill_service"
]


def get_user_service(session: Session = Depends(get_session)) -> UserService:
    return UserService(UserRepository(session=session))


def get_auth_service(session: Session = Depends(get_session)) -> AuthService:
    return AuthService(UserRepository(session=session))


def get_refill_service(session: Session = Depends(get_session)) -> RefillService:
    return RefillService(
        RefillRepository(session=session),
        RefillRentRepository(session=session)
    )
