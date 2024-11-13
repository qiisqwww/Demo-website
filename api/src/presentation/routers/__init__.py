from fastapi import APIRouter

from .auth import auth_routers
from .profile import profile_routers

__all__ = [
    "root_router"
]

root_router = APIRouter(prefix="/api")
root_router.include_router(auth_routers)
root_router.include_router(profile_routers)
