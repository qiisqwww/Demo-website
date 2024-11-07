from bcrypt import hashpw, checkpw, gensalt


_all__ = [
    "PasswdUtils"
]


class PasswdUtils:
    @staticmethod
    def hashed_password(password: str) -> str:
        salt = gensalt()
        return str(hashpw(password.encode(), salt).decode("utf-8"))  # TODO: разобраться с хранением пароля в bytes

    @staticmethod
    def password_valid(password: str, hashed_password: str) -> bool:
        return checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))
