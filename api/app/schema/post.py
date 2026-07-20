from typing import Optional

from pydantic import BaseModel

from app.model.post import PostStatus


class PostCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    category_id: str
    cover_image: Optional[str] = None
    status: PostStatus = PostStatus.DRAFT
    is_featured: bool = False


class PostUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category_id: Optional[str] = None
    cover_image: Optional[str] = None
    status: Optional[PostStatus] = None
    is_featured: Optional[bool] = None
