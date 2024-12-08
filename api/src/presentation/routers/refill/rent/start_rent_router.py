from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt import InvalidTokenError

from src.get_service import get_refill_service, get_auth_service
from src.services import RefillService, UserWasNotFoundException, AuthService, UserAlreadyStartedRentException

__all__ = [
    "start_rent_router"
]


start_rent_router = APIRouter()
http_bearer = HTTPBearer()


@start_rent_router.post("/start")
async def start_rent(
        token: Annotated[HTTPAuthorizationCredentials, Depends(http_bearer)],
        refill_service: RefillService = Depends(get_refill_service),
        auth_service: AuthService = Depends(get_auth_service),
        refill_id: int = Body(embed=True),
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
        started_rent = await refill_service.start_refill_rent(user.id, refill_id)
    except UserAlreadyStartedRentException:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User has already started rent"
        )

    return started_rent
