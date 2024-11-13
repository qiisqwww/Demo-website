from typing import Annotated

from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt import InvalidTokenError

from src.schemas import UserReturnData
from src.get_service import get_auth_service
from src.services import AuthService, UserWasNotFoundException

__all__ = [
    "me_router"
]


me_router = APIRouter()
http_bearer = HTTPBearer()


@me_router.get("/me", response_model=UserReturnData)
async def get_me(
        token: Annotated[HTTPAuthorizationCredentials, Depends(http_bearer)],
        auth_service: AuthService = Depends(get_auth_service)
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

    return user
