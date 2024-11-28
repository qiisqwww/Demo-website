from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import EmailStr
from jwt import InvalidTokenError

from src.schemas import UserReturnData
from src.services import AuthService, UserWasNotFoundException, UserService, EmailAlreadyUsedException
from src.get_service import get_auth_service, get_user_service

__all__ = [
    "edit_email_router"
]


edit_email_router = APIRouter()
http_bearer = HTTPBearer()


@edit_email_router.patch("/email", response_model=UserReturnData)
async def edit_email(
        token: Annotated[HTTPAuthorizationCredentials, Depends(http_bearer)],
        auth_service: AuthService = Depends(get_auth_service),
        user_service: UserService = Depends(get_user_service),
        email: EmailStr = Body(min_length=3, max_length=150, embed=True)
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
        edited_user = await user_service.edit_email(user, email)
    except EmailAlreadyUsedException:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="User with this email already exists"
        )

    return edited_user
