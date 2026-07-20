from typing import List, Optional
from sqlalchemy import Column, String
from sqlmodel import SQLModel, Field, Relationship

from app.model.mixins import TimeMixin


class Category(SQLModel, TimeMixin, table=True):
    __tablename__ = "category"

    id: Optional[str] = Field(None, primary_key=True, nullable=False)
    name: str = Field(sa_column=Column("name", String, unique=True))
    slug: str = Field(sa_column=Column("slug", String, unique=True, index=True))
    description: Optional[str] = None

    posts: List["Post"] = Relationship(back_populates="category")
