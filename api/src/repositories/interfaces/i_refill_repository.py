from abc import ABC, abstractmethod

from src.models import Refill

__all__ = [
    "IRefillRepository"
]


class IRefillRepository(ABC):
    @abstractmethod
    async def insert_refill(self, refill_create_data: dict) -> Refill:
        ...

    @abstractmethod
    async def delete_refill(self, refill_id: int) -> Refill:
        ...

    @abstractmethod
    async def get_all_refills(self) -> list[Refill]:
        ...

    @abstractmethod
    async def find_refill_by_id(self, refill_id) -> Refill | None:
        ...
