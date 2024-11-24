from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt import InvalidTokenError

from src.schemas import UserReturnData, UserData
from src.services import AuthService, UserWasNotFoundException, UserService
from src.get_service import get_auth_service, get_user_service

__all__ = [
    "edit_about_router"
]


edit_about_router = APIRouter()
http_bearer = HTTPBearer()


@edit_about_router.patch("/about", response_model=UserReturnData)
async def edit_about(
        token: Annotated[HTTPAuthorizationCredentials, Depends(http_bearer)],
        auth_service: AuthService = Depends(get_auth_service),
        user_service: UserService = Depends(get_user_service),
        about: str = Body(min_length=5, max_length=150),
) -> UserData:
    try:
        user = await auth_service.authorize(token.credentials)
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except UserWasNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    edited_user = await user_service.edit_about(user, about)
