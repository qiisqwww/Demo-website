from typing import List

from fastapi import APIRouter, Depends

from src.get_service import get_refill_service
from src.services import RefillService
from src.schemas import Refill

__all__ = [
    "get_all_router"
]


get_all_router = APIRouter()


@get_all_router.get("/all", response_model=List[Refill])
async def get_all_refills(refill_service: RefillService = Depends(get_refill_service)):
    refills = await refill_service.get_all_refills()
    return refills
