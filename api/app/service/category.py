from uuid import uuid4

from fastapi import HTTPException

from app.model import Category
from app.repository.category import CategoryRepository
from app.utils import generate_unique_slug


class CategoryService:

    @staticmethod
    def _serialize(category: Category) -> dict:
        return {
            "id": category.id,
            "name": category.name,
            "slug": category.slug,
            "description": category.description,
        }

    @staticmethod
    async def list_categories() -> list:
        categories = await CategoryRepository.get_all()
        return [CategoryService._serialize(c) for c in categories]

    @staticmethod
    async def get_by_slug(slug: str) -> dict:
        category = await CategoryRepository.find_by_slug(slug)
        if category is None:
            raise HTTPException(status_code=404, detail="Category not found!")
        return CategoryService._serialize(category)

    @staticmethod
    async def create_category(name: str, description: str = None) -> dict:
        existing = await CategoryRepository.find_by_name(name)
        if existing:
            raise HTTPException(status_code=400, detail="Category already exists!")

        async def _slug_taken(candidate_slug: str) -> bool:
            return await CategoryRepository.find_by_slug(candidate_slug) is not None

        slug = await generate_unique_slug(name, _slug_taken)
        category = await CategoryRepository.create(
            id=str(uuid4()), name=name, slug=slug, description=description
        )
        return CategoryService._serialize(category)
