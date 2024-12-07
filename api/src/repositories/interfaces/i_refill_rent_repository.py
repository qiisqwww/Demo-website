from abc import ABC, abstractmethod

from src.models import RefillRent

__all__ = [
    "IRefillRentRepository"
]


class IRefillRentRepository(ABC):
    @abstractmethod
    async def get_user_last_refill_rents(self, user_id: int) -> list[RefillRent]:
        ...

    @abstractmethod
    async def start_rent(self, user_id: int, refill_id: int) -> RefillRent:
        ...

    @abstractmethod
    async def finish_rent(self, rent_id: int) -> RefillRent:
        ...

    @abstractmethod
    async def find_rent_by_id(self, rent_id: int) -> RefillRent:
        ...

    @abstractmethod
    async def find_user_unfinished_rent(self, user_id: int) -> RefillRent | None:
        ...
