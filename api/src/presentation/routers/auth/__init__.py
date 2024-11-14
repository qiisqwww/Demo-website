from fastapi import APIRouter

from .registration_router import registration_router
from .login_router import login_router
from .token_router import token_router

__all__ = [
    "auth_routers"
]


auth_routers = APIRouter()
auth_routers.include_router(registration_router)
auth_routers.include_router(login_router)
auth_routers.include_router(token_router)
