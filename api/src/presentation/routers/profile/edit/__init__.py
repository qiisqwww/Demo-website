from fastapi import APIRouter

from .edit_about_router import edit_about_router
from .edit_avatar_router import edit_avatar_router

__all__ = [
    "edit_router"
]


edit_router = APIRouter(prefix="/edit")
edit_router.include_router(edit_about_router)
edit_router.include_router(edit_avatar_router)