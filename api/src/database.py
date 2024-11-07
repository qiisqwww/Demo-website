from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from src.config import MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_HOST

__all__ = [
    "get_session"
]

DATABASE_URL = f'mysql+mysqlconnector://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}'
engine = create_engine(DATABASE_URL)
session_maker = sessionmaker(engine, class_=Session, expire_on_commit=False)


def get_session():
    with session_maker() as session:
        yield session
