from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from src.config import DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_HOST

__all__ = [
    "get_session"
]

DATABASE_URL = f'postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
engine = create_engine(DATABASE_URL)
session_maker = sessionmaker(engine, class_=Session, expire_on_commit=False)


def get_session() -> Generator[Session, None, None]:
    with session_maker() as session:
        yield session
