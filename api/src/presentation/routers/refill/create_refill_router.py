from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt import InvalidTokenError

from src.get_service import get_refill_service, get_auth_service
from src.services import RefillService, UserWasNotFoundException, AuthService, NotEnoughRightsException
from src.schemas import RefillCreate

__all__ = [
    "create_refill_router"
]


create_refill_router = APIRouter()
http_bearer = HTTPBearer()


@create_refill_router.post("/create")
async def create_refill(
        token: Annotated[HTTPAuthorizationCredentials, Depends(http_bearer)],
        refill_create_data: RefillCreate,
        refill_service: RefillService = Depends(get_refill_service),
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

    try:
        new_refill = await refill_service.create_new_refill(refill_create_data, user)
    except NotEnoughRightsException:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User must be admin to create refill"
        )

    return new_refill
