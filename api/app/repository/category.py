from sqlalchemy.future import select

from app.config import db
from app.model import Category
from app.repository.base_repo import BaseRepo


class CategoryRepository(BaseRepo):
    model = Category

    @staticmethod
    async def find_by_slug(slug: str):
        query = select(Category).where(Category.slug == slug)
        return (await db.execute(query)).scalar_one_or_none()

    @staticmethod
    async def find_by_name(name: str):
        query = select(Category).where(Category.name == name)
        return (await db.execute(query)).scalar_one_or_none()
