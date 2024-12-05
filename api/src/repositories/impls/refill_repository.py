from sqlalchemy.ext.asyncio import AsyncSession

from src.repositories.interfaces import IRefillRepository

__all__ = [
    "RefillRepository"
]


class RefillRepository(IRefillRepository):
    _session: AsyncSession

    def __init__(self, session: AsyncSession):
        self._session = session
