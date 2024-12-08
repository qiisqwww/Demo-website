from datetime import datetime

from sqlalchemy.orm import Session
from sqlalchemy import select, desc, insert, update

from src.repositories.interfaces import IRefillRentRepository
from src.models import RefillRent

__all__ = [
    "RefillRentRepository"
]


class RefillRentRepository(IRefillRentRepository):
    _session: Session
    _model: type[RefillRent]

    def __init__(self, session: Session):
        self._session = session
        self._model = RefillRent

    async def get_user_last_refill_rents(self, user_id: int) -> list[RefillRent]:
        stmt = (
            select(self._model)
            .where(self._model.user_id == user_id)
            .order_by(desc(self._model.time_start))
            .limit(5)
        )

        return [refill_rent for refill_rent in self._session.scalars(stmt)]

    async def start_rent(self, user_id: int, refill_id: int) -> RefillRent:
        stmt = (
            insert(self._model)
            .values(user_id=user_id, refill_id=refill_id, time_start=datetime.now())
            .returning(self._model)
        )
        result = self._session.execute(stmt)
        self._session.commit()

        return result.scalar()

    async def finish_rent(self, rent_id: int) -> RefillRent:
        stmt = (
            update(self._model)
            .where(self._model.id == rent_id)
            .values(time_end=datetime.now())
            .returning(self._model)
        )
        result = self._session.execute(stmt)
        self._session.commit()

        return result.scalar()

    async def find_rent_by_id(self, rent_id: int) -> RefillRent:
        stmt = select(self._model).where(self._model.id == rent_id)
        return self._session.scalar(stmt)

    async def find_user_unfinished_rent(self, user_id: int) -> RefillRent | None:
        stmt = select(self._model).where(self._model.user_id == user_id, self._model.time_end.is_(None))
        return self._session.scalar(stmt)
