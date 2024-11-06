from fastapi import APIRouter, Depends, status, HTTPException

from src.services import UserService, EmailAlreadyUsedException, UsernameAlreadyUsedException
from src.schemas import UserInputData
from src.get_service import get_user_service

__all__ = [
    "registration_router"
]


registration_router = APIRouter()


@registration_router.post("/registration")
async def register_user(user: UserInputData, user_service: UserService = Depends(get_user_service)):
    try:
        await user_service.register(user)
    except UsernameAlreadyUsedException as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="User with this username already exists"
        ) from e
    except EmailAlreadyUsedException as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="User with this email already exists"
        ) from e
