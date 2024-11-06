from datetime import timedelta, datetime, timezone

from jwt import decode, encode

from src.schemas import UserData
from src.config import ACCESS_TOKEN_EXPIRE_DAYS, SECRET

_all__ = [
    "TokenUtils"
]


class TokenUtils:
    @staticmethod
    def create_token(user: UserData) -> str:
        expire = datetime.now(timezone.utc) + TokenUtils._get_timedelta_for_token()

        user_payload = {
            "sub": user.username,
            "exp": expire
        }

        access_token = encode(user_payload, SECRET)
        return access_token

    @staticmethod
    def _get_timedelta_for_token() -> timedelta:
        return timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)

    @staticmethod
    def decode_token(token: str | bytes) -> dict:
        decoded_jwt = decode(token, SECRET, algorithms=['HS256'])
        return decoded_jwt
