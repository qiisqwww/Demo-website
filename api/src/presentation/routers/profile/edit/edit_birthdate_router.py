from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt import InvalidTokenError

from src.schemas import UserReturnData
from src.services import AuthService, UserWasNotFoundException, UserService, InvalidDataFormatException
from src.get_service import get_auth_service, get_user_service

__all__ = [
    "edit_birthdate_router"
]


edit_birthdate_router = APIRouter()
http_bearer = HTTPBearer()


@edit_birthdate_router.patch("/birthdate", response_model=UserReturnData)
async def edit_birthdate(
        token: Annotated[HTTPAuthorizationCredentials, Depends(http_bearer)],
        auth_service: AuthService = Depends(get_auth_service),
        user_service: UserService = Depends(get_user_service),
        birthdate: str = Body(embed=True)
):
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

    try:
        edited_user = await user_service.edit_birthdate(user, birthdate)
    except InvalidDataFormatException:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Date format must be DD.MM.YYYY"
        )

    return edited_user
