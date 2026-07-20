from typing import Optional
from sqlmodel import SQLModel, Field

from app.model.mixins import TimeMixin


class ContactMessage(SQLModel, TimeMixin, table=True):
    __tablename__ = "contact_message"

    id: Optional[str] = Field(None, primary_key=True, nullable=False)
    name: str
    email: str
    subject: str
    message: str
