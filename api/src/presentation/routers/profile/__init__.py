from fastapi import APIRouter

from .me_router import me_router
from .edit import edit_router

__all__ = [
    "profile_routers"
]


profile_routers = APIRouter(prefix="/profile")
profile_routers.include_router(me_router)
profile_routers.include_router(edit_router)
