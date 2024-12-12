from sqlalchemy.orm import Session
from sqlalchemy import select, insert, delete

from src.models import Refill
from src.repositories.interfaces import IRefillRepository

__all__ = [
    "RefillRepository"
]


class RefillRepository(IRefillRepository):
    _session: Session
    _model: type[Refill]

    def __init__(self, session: Session):
        self._session = session
        self._model = Refill

    async def insert_refill(self, refill_create_data: dict) -> Refill:
        stmt = insert(self._model).values(**refill_create_data).returning(self._model)
        result = self._session.execute(stmt)
        self._session.commit()

        return result.scalar()

    async def delete_refill(self, refill_id: int) -> Refill:
        stmt = delete(self._model).where(self._model.id == refill_id).returning(self._model)
        result = self._session.execute(stmt)
        self._session.commit()

        return result.scalar()

    async def get_all_refills(self) -> list[Refill]:
        stmt = select(self._model)
        return [refill for refill in self._session.scalars(stmt)]

    async def find_refill_by_id(self, refill_id) -> Refill | None:
        stmt = select(self._model).where(self._model.id == refill_id)
        return self._session.scalar(stmt)
