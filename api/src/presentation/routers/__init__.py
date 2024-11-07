from fastapi import APIRouter

from .login_router import login_router
from .registration_router import registration_router
from .me_router import me_router

__all__ = [
    "root_router"
]

root_router = APIRouter()
root_router.include_router(login_router)
root_router.include_router(registration_router)
root_router.include_router(me_router)
