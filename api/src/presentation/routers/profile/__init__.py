from fastapi import APIRouter

from .me_router import me_router
from .profile_image_router import profile_image_router

__all__ = [
    "profile_routers"
]


profile_routers = APIRouter()
profile_routers.include_router(me_router)
profile_routers.include_router(profile_image_router)
