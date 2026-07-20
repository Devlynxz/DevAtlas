from datetime import datetime
from enum import Enum
from typing import Optional
from sqlalchemy import Column, String
from sqlmodel import SQLModel, Field, Relationship

from app.model.mixins import TimeMixin


class PostStatus(str, Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"


class Post(SQLModel, TimeMixin, table=True):
    __tablename__ = "post"

    id: Optional[str] = Field(None, primary_key=True, nullable=False)
    title: str
    slug: str = Field(sa_column=Column("slug", String, unique=True, index=True))
    excerpt: str
    content: str
    cover_image: Optional[str] = None
    status: PostStatus = Field(default=PostStatus.DRAFT)
    is_featured: bool = Field(default=False)
    reading_time: int = Field(default=1)
    published_at: Optional[datetime] = None

    author_id: Optional[str] = Field(default=None, foreign_key="users.id")
    author: Optional["Users"] = Relationship(back_populates="posts")

    category_id: Optional[str] = Field(default=None, foreign_key="category.id")
    category: Optional["Category"] = Relationship(back_populates="posts")
