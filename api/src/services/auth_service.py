from src.repositories.i_user_repository import IUserRepository
from src.utils import PasswdUtils, TokenUtils
from src.schemas import Token, UserData

__all__ = [
    "AuthService",
    "UserWasNotFoundException",
    "UserIsNotActiveException"
]


class UserWasNotFoundException(Exception):
    """
    Raised when a user wasn't found
    """


class UserIsNotActiveException(Exception):
    """
    Raised when a user isn't active
    """


class AuthService:
    _user_repository: IUserRepository

    def __init__(self, user_repository: IUserRepository) -> None:
        self._user_repository = user_repository

    async def authenticate(self, username: str, password: str) -> Token:
        user = await self._user_repository.find_user_by_username(username)
        if not user or not PasswdUtils.password_valid(password, user.hashed_password):
            raise UserWasNotFoundException

        if not user.is_active:
            raise UserIsNotActiveException

        return Token(access_token=TokenUtils.create_token(user))

    async def authorize(self, token: str) -> UserData:
        payload = TokenUtils.decode_token(token)

        username = payload.get("sub")
        if not username:
            raise UserWasNotFoundException

        user = await self._user_repository.find_user_by_username(username)
        if not user:
            raise UserWasNotFoundException

        return user
