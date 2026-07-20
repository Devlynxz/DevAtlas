from typing import List, Optional, Tuple
from sqlalchemy import func
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.config import db
from app.model import Category, Post, PostStatus, Users
from app.repository.base_repo import BaseRepo

_POST_RELATIONS = (
    selectinload(Post.category),
    selectinload(Post.author).selectinload(Users.person),
)


class PostRepository(BaseRepo):
    model = Post

    @staticmethod
    async def find_by_slug(slug: str) -> Optional[Post]:
        query = select(Post).options(*_POST_RELATIONS).where(Post.slug == slug)
        return (await db.execute(query)).scalar_one_or_none()

    @staticmethod
    async def list_posts(
        page: int = 1,
        page_size: int = 9,
        category_slug: Optional[str] = None,
        author_username: Optional[str] = None,
        search: Optional[str] = None,
        status: Optional[PostStatus] = PostStatus.PUBLISHED,
        featured: Optional[bool] = None,
    ) -> Tuple[List[Post], int]:
        query = select(Post).options(*_POST_RELATIONS)
        count_query = select(func.count()).select_from(Post)

        if category_slug:
            query = query.join(Category, Post.category_id == Category.id)
            count_query = count_query.join(Category, Post.category_id == Category.id)
        if author_username:
            query = query.join(Users, Post.author_id == Users.id)
            count_query = count_query.join(Users, Post.author_id == Users.id)

        if status is not None:
            query = query.where(Post.status == status)
            count_query = count_query.where(Post.status == status)
        if category_slug:
            query = query.where(Category.slug == category_slug)
            count_query = count_query.where(Category.slug == category_slug)
        if author_username:
            query = query.where(Users.username == author_username)
            count_query = count_query.where(Users.username == author_username)
        if search:
            query = query.where(Post.title.ilike(f"%{search}%"))
            count_query = count_query.where(Post.title.ilike(f"%{search}%"))
        if featured is not None:
            query = query.where(Post.is_featured == featured)
            count_query = count_query.where(Post.is_featured == featured)

        query = query.order_by(Post.published_at.desc().nullslast(), Post.created_at.desc())
        query = query.offset((page - 1) * page_size).limit(page_size)

        items = (await db.execute(query)).scalars().all()
        total = (await db.execute(count_query)).scalar_one()
        return list(items), total

    @staticmethod
    async def find_related(category_id: str, exclude_post_id: str, limit: int = 3) -> List[Post]:
        query = (
            select(Post)
            .options(*_POST_RELATIONS)
            .where(
                Post.category_id == category_id,
                Post.id != exclude_post_id,
                Post.status == PostStatus.PUBLISHED,
            )
            .order_by(Post.published_at.desc())
            .limit(limit)
        )
        return list((await db.execute(query)).scalars().all())

    @staticmethod
    async def popular_authors(limit: int = 6):
        query = (
            select(Users, func.count(Post.id).label("post_count"))
            .join(Post, Post.author_id == Users.id)
            .options(selectinload(Users.person))
            .where(Post.status == PostStatus.PUBLISHED)
            .group_by(Users.id)
            .order_by(func.count(Post.id).desc())
            .limit(limit)
        )
        return (await db.execute(query)).all()
