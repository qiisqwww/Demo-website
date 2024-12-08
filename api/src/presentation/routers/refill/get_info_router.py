from fastapi import APIRouter, Depends, Query, HTTPException, status

from src.get_service import get_refill_service
from src.services import RefillService, RefillWasNotFoundException

__all__ = [
    "get_info_router"
]


get_info_router = APIRouter()


@get_info_router.get("/info")
async def get_refill_info(
        refill_service: RefillService = Depends(get_refill_service),
        refill_id: int = Query()
):
    try:
        refill = await refill_service.get_refill_info(refill_id)
    except RefillWasNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Refill with id {refill_id} was not found"
        )

    return refill
