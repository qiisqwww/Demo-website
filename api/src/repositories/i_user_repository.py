from abc import ABC, abstractmethod

from src.schemas import UserCreateData
from src.models import User

__all__ = [
    "IUserRepository",
]


class IUserRepository(ABC):
    @abstractmethod
    async def insert_user(self, user_create_data: UserCreateData) -> User:
        ...

    @abstractmethod
    async def find_user_by_id(self, user_id: int) -> User | None:
        ...

    @abstractmethod
    async def find_user_by_username(self, username: str) -> User | None:
        ...

    @abstractmethod
    async def find_user_by_email(self, email: str) -> User | None:
        ...
