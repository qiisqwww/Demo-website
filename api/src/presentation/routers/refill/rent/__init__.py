from fastapi import APIRouter

from .get_user_last_rents_router import get_user_last_rents_router
from .start_rent_router import start_rent_router
from .finish_rent_router import finish_rent_router

__all__ = [
    "rent_router"
]


rent_router = APIRouter(prefix="/rent")
rent_router.include_router(get_user_last_rents_router)
rent_router.include_router(start_rent_router)
rent_router.include_router(finish_rent_router)
