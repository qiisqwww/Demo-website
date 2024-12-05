from datetime import datetime

from sqlalchemy import Column, Integer, DateTime, ForeignKey

from src.models.declarative_base import Base

__all__ = [
    "RefillRent"
]


class RefillRent(Base):
    __tablename__ = "refill_rents"

    id: int = Column(Integer, primary_key=True, unique=True)
    user_id: int = Column(Integer, ForeignKey("users.id"), nullable=False)
    refill_id: int = Column(Integer, ForeignKey("refills.id"), nullable=False)
    time_start: datetime = Column(DateTime, nullable=False)
    time_end: datetime = Column(DateTime)
