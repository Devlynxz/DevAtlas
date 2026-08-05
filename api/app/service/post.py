from datetime import datetime
from typing import Optional
from uuid import uuid4

from fastapi import HTTPException, UploadFile

from app.model import Post, PostStatus, Users
from app.repository.category import CategoryRepository
from app.repository.post import PostRepository
from app.utils import compute_reading_time, delete_uploaded_file_if_owned, generate_unique_slug, save_uploaded_image

COVER_IMAGE_DIR = "media/posts"


class PostService:

    @staticmethod
    async def upload_cover_image(upload_file: UploadFile) -> str:
        return await save_uploaded_image(upload_file, COVER_IMAGE_DIR)

    @staticmethod
    def delete_cover_image(image_path: str) -> None:
        delete_uploaded_file_if_owned(image_path, COVER_IMAGE_DIR)

    @staticmethod
    def _serialize_author(author: Optional[Users]) -> Optional[dict]:
        if author is None:
            return None
        person = author.person
        return {
            "username": author.username,
            "name": person.name if person else author.username,
            "avatar": person.profile if person else None,
        }

    @staticmethod
    def _serialize(post: Post) -> dict:
        return {
            "id": post.id,
            "title": post.title,
            "slug": post.slug,
            "excerpt": post.excerpt,
            "content": post.content,
            "cover_image": post.cover_image,
            "status": post.status,
            "is_featured": post.is_featured,
            "reading_time": post.reading_time,
            "published_at": post.published_at,
            "created_at": post.created_at,
            "category": {"id": post.category.id, "name": post.category.name, "slug": post.category.slug} if post.category else None,
            "author": PostService._serialize_author(post.author),
        }

    @staticmethod
    async def _unique_slug(title: str, exclude_id: Optional[str] = None) -> str:
        async def _slug_taken(candidate_slug: str) -> bool:
            existing = await PostRepository.find_by_slug(candidate_slug)
            return existing is not None and existing.id != exclude_id

        return await generate_unique_slug(title, _slug_taken)

    @staticmethod
    def _is_admin(user: Users) -> bool:
        return any(role.role_name == "admin" for role in user.roles)

    @staticmethod
    async def _get_owned_post(post_id: str, current_user: Users) -> Post:
        post = await PostRepository.get_by_id(post_id)
        if post is None:
            raise HTTPException(status_code=404, detail="Post not found!")
        if post.author_id != current_user.id and not PostService._is_admin(current_user):
            raise HTTPException(status_code=403, detail="You can only modify your own posts!")
        return post

    @staticmethod
    async def create_post(current_user: Users, data) -> dict:
        category = await CategoryRepository.get_by_id(data.category_id)
        if category is None:
            raise HTTPException(status_code=400, detail="Category not found!")

        slug = await PostService._unique_slug(data.title)
        created = await PostRepository.create(
            id=str(uuid4()),
            title=data.title,
            slug=slug,
            excerpt=data.excerpt,
            content=data.content,
            cover_image=data.cover_image,
            status=data.status,
            is_featured=data.is_featured,
            reading_time=compute_reading_time(data.content),
            published_at=datetime.now() if data.status == PostStatus.PUBLISHED else None,
            author_id=current_user.id,
            category_id=data.category_id,
        )
        post = await PostRepository.find_by_slug(created.slug)
        return PostService._serialize(post)

    @staticmethod
    async def update_post(post_id: str, current_user: Users, data) -> dict:
        post = await PostService._get_owned_post(post_id, current_user)
        update_data = data.dict(exclude_unset=True)

        if "title" in update_data:
            update_data["slug"] = await PostService._unique_slug(update_data["title"], exclude_id=post.id)
        if "content" in update_data:
            update_data["reading_time"] = compute_reading_time(update_data["content"])
        if "category_id" in update_data:
            category = await CategoryRepository.get_by_id(update_data["category_id"])
            if category is None:
                raise HTTPException(status_code=400, detail="Category not found!")
        if update_data.get("status") == PostStatus.PUBLISHED and post.published_at is None:
            update_data["published_at"] = datetime.now()

        replaces_cover_image = "cover_image" in update_data and update_data["cover_image"] != post.cover_image

        if update_data:
            await PostRepository.update(post.id, **update_data)

        if replaces_cover_image and post.cover_image:
            PostService.delete_cover_image(post.cover_image)

        refreshed = await PostRepository.get_by_id(post.id)
        updated = await PostRepository.find_by_slug(refreshed.slug)
        return PostService._serialize(updated)

    @staticmethod
    async def delete_post(post_id: str, current_user: Users):
        post = await PostService._get_owned_post(post_id, current_user)
        await PostRepository.delete(post_id)
        if post.cover_image:
            PostService.delete_cover_image(post.cover_image)

    @staticmethod
    async def get_by_id_for_owner(post_id: str, current_user: Users) -> dict:
        post = await PostService._get_owned_post(post_id, current_user)
        full_post = await PostRepository.find_by_slug(post.slug)
        return PostService._serialize(full_post)

    @staticmethod
    async def get_by_slug_public(slug: str) -> dict:
        post = await PostRepository.find_by_slug(slug)
        if post is None or post.status != PostStatus.PUBLISHED:
            raise HTTPException(status_code=404, detail="Post not found!")
        return PostService._serialize(post)

    @staticmethod
    async def list_posts(page: int, page_size: int, category: Optional[str],
                          author: Optional[str], search: Optional[str],
                          featured: Optional[bool] = None) -> dict:
        items, total = await PostRepository.list_posts(
            page=page, page_size=page_size, category_slug=category,
            author_username=author, search=search, status=PostStatus.PUBLISHED,
            featured=featured,
        )
        return {
            "items": [PostService._serialize(p) for p in items],
            "total": total,
            "page": page,
            "page_size": page_size,
        }

    @staticmethod
    async def list_my_posts(current_user: Users, page: int, page_size: int) -> dict:
        items, total = await PostRepository.list_posts(
            page=page, page_size=page_size, category_slug=None,
            author_username=current_user.username, search=None, status=None,
        )
        return {
            "items": [PostService._serialize(p) for p in items],
            "total": total,
            "page": page,
            "page_size": page_size,
        }

    @staticmethod
    async def get_related(slug: str, limit: int = 3) -> list:
        post = await PostRepository.find_by_slug(slug)
        if post is None or post.category_id is None:
            return []
        related = await PostRepository.find_related(post.category_id, post.id, limit)
        return [PostService._serialize(p) for p in related]
