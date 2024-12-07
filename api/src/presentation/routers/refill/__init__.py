from fastapi import APIRouter

from .get_all_router import get_all_router
from .get_info_router import get_info_router
from .create_refill_router import create_refill_router
from .delete_refill_router import delete_refill_router
from .rent import rent_router

__all__ = [
    "refill_router"
]


refill_router = APIRouter(prefix="/refill")
refill_router.include_router(get_all_router)
refill_router.include_router(get_info_router)
refill_router.include_router(create_refill_router)
refill_router.include_router(delete_refill_router)
refill_router.include_router(rent_router)
