from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt import InvalidTokenError

from src.get_service import get_refill_service, get_auth_service
from src.services import (
    RefillService,
    UserWasNotFoundException,
    AuthService,
    RefillWasNotFoundException,
    NotEnoughRightsException
)

__all__ = [
    "delete_refill_router"
]


delete_refill_router = APIRouter()
http_bearer = HTTPBearer()


@delete_refill_router.delete("/delete")
async def delete_refill(
        token: Annotated[HTTPAuthorizationCredentials, Depends(http_bearer)],
        refill_service: RefillService = Depends(get_refill_service),
        auth_service: AuthService = Depends(get_auth_service),
        refill_id: int = Body(embed=True)
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
        deleted_refill = await refill_service.delete_refill(refill_id, user)
    except NotEnoughRightsException:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User must be admin to delete refill"
        )
    except RefillWasNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Refill with received id does not exist"
        )
    return deleted_refill
