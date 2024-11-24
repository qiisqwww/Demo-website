from datetime import date

from sqlalchemy.orm import Session
from sqlalchemy import select, insert, update

from src.models import User
from src.schemas import UserCreateData
from src.repositories.i_user_repository import IUserRepository

__all__ = [
    "UserRepository",
]


class UserRepository(IUserRepository):  # TODO: use context managers for commiting & move to asyncpg
    _session: Session
    _model: type[User]

    def __init__(self, session: Session) -> None:
        self._session = session
        self._model = User

    async def insert_user(self, user_create_data: UserCreateData) -> User:
        stmt = (insert(self._model).values(**user_create_data.dict()).returning(self._model))
        result = self._session.execute(stmt)
        self._session.commit()

        return result.scalars().first()

    async def find_user_by_id(self, user_id: int) -> User | None:
        stmt = (select(self._model).where(self._model.id == user_id))
        user = self._session.scalar(stmt)

        return user

    async def find_user_by_username(self, username: str) -> User | None:
        stmt = select(self._model).where(self._model.username == username)
        user = self._session.scalar(stmt)

        return user

    async def find_user_by_email(self, email: str) -> User | None:
        stmt = select(self._model).where(self._model.email == email)
        user = self._session.scalar(stmt)

        return user

    async def update_user_avatar_by_id(self, user_id: int, photo_url: str) -> None:
        stmt = update(self._model).where(self._model.id == user_id).values(photo_url=photo_url)
        self._session.execute(stmt)
        self._session.commit()

    async def update_user_about_by_id(self, user_id: int, about: str) -> None:
        stmt = update(self._model).where(self._model.id == user_id).values(about=about)
        self._session.execute(stmt)
        self._session.commit()

    async def update_user_birthdate_by_id(self, user_id: int, birthdate: date) -> None:
        stmt = update(self._model).where(self._model.id == user_id).values(birthdate=birthdate)
        self._session.execute(stmt)
        self._session.commit()
