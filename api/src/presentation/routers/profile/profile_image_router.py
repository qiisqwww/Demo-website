from typing import Annotated

from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt import InvalidTokenError

from src.schemas import UserReturnData
from src.get_service import get_auth_service, get_user_service
from src.services import AuthService, UserWasNotFoundException, UserService

__all__ = [
    "profile_image_router",
]


profile_image_router = APIRouter()
http_bearer = HTTPBearer()


@profile_image_router.post("/profile-image", response_model=UserReturnData)
async def set_profile_image(
        token: Annotated[HTTPAuthorizationCredentials, Depends(http_bearer)],
        auth_service: AuthService = Depends(get_auth_service),
        user_service: UserService = Depends(get_user_service),
        user_image: UploadFile = File(...),
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

    filename = "user_" + user.username + '.' + user_image.filename.split('.')[-1]
    user = await user_service.set_profile_photo(user, await user_image.read(), filename)

    return user
