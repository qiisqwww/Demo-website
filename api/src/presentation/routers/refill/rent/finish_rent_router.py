from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt import InvalidTokenError

from src.get_service import get_refill_service, get_auth_service
from src.services import RefillService, UserWasNotFoundException, AuthService, CannotFinishRentException

__all__ = [
    "finish_rent_router"
]


finish_rent_router = APIRouter()
http_bearer = HTTPBearer()


@finish_rent_router.patch("/finish")
async def finish_rent(
        token: Annotated[HTTPAuthorizationCredentials, Depends(http_bearer)],
        refill_service: RefillService = Depends(get_refill_service),
        auth_service: AuthService = Depends(get_auth_service),
        refill_rent_id: int = Body(embed=True),
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
        finished_rent = await refill_service.finish_refill_rent(user.id, refill_rent_id)
    except CannotFinishRentException:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User hasn't started rent with received rent_id"
        )

    return finished_rent
