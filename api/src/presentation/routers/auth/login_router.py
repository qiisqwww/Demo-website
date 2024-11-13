from fastapi import APIRouter, Depends, HTTPException, status, Body

from src.get_service import get_auth_service
from src.services import AuthService, UserWasNotFoundException, UserIsNotActiveException
from src.schemas import Token

__all__ = [
    "login_router"
]


login_router = APIRouter()


@login_router.post("/login")
async def login_user(
        username: str = Body(),
        password: str = Body(),
        auth_service: AuthService = Depends(get_auth_service)
) -> Token:
    try:
        token = await auth_service.authenticate(username, password)
    except UserWasNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e
    except UserIsNotActiveException as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not active"
        ) from e

    return token
