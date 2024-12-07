from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime

from src.models.declarative_base import Base

__all__ = [
    "Refill"
]


class Refill(Base):
    __tablename__ = "refill"

    id = Column(Integer, primary_key=True, unique=True)
    address = Column(String(length=255), nullable=False)
    power = Column(Float, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
