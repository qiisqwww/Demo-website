from enum import StrEnum, verify, UNIQUE

__all__ = [
    "Role"
]


@verify(UNIQUE)
class Role(StrEnum):
    ADMIN = "admin"
    USER = "user"
