from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt import InvalidTokenError

from src.get_service import get_refill_service, get_auth_service
from src.services import RefillService, UserWasNotFoundException, AuthService

__all__ = [
    "get_user_last_rents_router"
]


get_user_last_rents_router = APIRouter()
http_bearer = HTTPBearer()


@get_user_last_rents_router.get("/last")
async def get_user_last_rents(
        token: Annotated[HTTPAuthorizationCredentials, Depends(http_bearer)],
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

    last_user_rents = await refill_service.get_last_user_refill_rents(user.id)
    return last_user_rents
