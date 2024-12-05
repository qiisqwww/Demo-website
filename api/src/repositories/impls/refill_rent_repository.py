from sqlalchemy.ext.asyncio import AsyncSession

from src.repositories.interfaces import IRefillRentRepository

__all__ = [
    "RefillRentRepository"
]


class RefillRentRepository(IRefillRentRepository):
    _session: AsyncSession

    def __init__(self, session: AsyncSession):
        self._session = session
