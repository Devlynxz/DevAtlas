from typing import Optional
from sqlalchemy import Column, String
from sqlmodel import SQLModel, Field

from app.model.mixins import TimeMixin


class NewsletterSubscriber(SQLModel, TimeMixin, table=True):
    __tablename__ = "newsletter_subscriber"

    id: Optional[str] = Field(None, primary_key=True, nullable=False)
    email: str = Field(sa_column=Column("email", String, unique=True))
