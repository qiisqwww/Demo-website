from src.repositories.i_user_repository import IUserRepository
from src.schemas import UserInputData, UserCreateData
from src.utils import PasswdUtils

__all__ = [
    "UserService",
    "UsernameAlreadyUsedException",
    "EmailAlreadyUsedException",
]


class UsernameAlreadyUsedException(Exception):
    """
    Raised when trying to register user with username that already used
    """


class EmailAlreadyUsedException(Exception):
    """
    Raised when trying to register user with email that already used
    """


class UserService:
    _user_repository: IUserRepository

    def __init__(self, user_repository: IUserRepository) -> None:
        self._user_repository = user_repository

    async def register(self, user_register_data: UserInputData) -> None:
        user_username_used = await self._user_repository.find_user_by_username(user_register_data.username)
        if user_username_used:
            raise UsernameAlreadyUsedException

        user_email_exists = await self._user_repository.find_user_by_email(user_register_data.email)
        if user_email_exists:
            raise EmailAlreadyUsedException

        hashed_password = PasswdUtils.hashed_password(user_register_data.password)
        user_create_data = UserCreateData.get_from_register_data(user_register_data, hashed_password)

        await self._user_repository.insert_user(user_create_data)
