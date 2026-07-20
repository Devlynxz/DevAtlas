from fastapi import HTTPException, UploadFile
from sqlalchemy.future import select

from app.config import db
from app.model import Users, Person, PostStatus
from app.repository.person import PersonRepository
from app.repository.post import PostRepository
from app.repository.users import UsersRepository
from app.utils import DEFAULT_AVATAR_PATH, delete_uploaded_file_if_owned, save_uploaded_image

AVATAR_DIR = "media/avatars"


class UserService:

    @staticmethod
    async def get_user_profile(username: str):
        query = select(Users.username,
                        Users.email,
                        Person.name,
                        Person.birth,
                        Person.sex,
                        Person.profile,
                        Person.phone_number,
                        Person.bio,
                        Person.social_github,
                        Person.social_linkedin,
                        Person.social_twitter,
                        Person.social_website).join_from(Users, Person).where(Users.username == username)
        return(await db.execute(query)).mappings().one()

    @staticmethod
    async def update_profile(current_user: Users, data) -> dict:
        update_data = data.dict(exclude_unset=True)
        if update_data:
            await PersonRepository.update(current_user.person_id, **update_data)
        return await UserService.get_user_profile(current_user.username)

    @staticmethod
    async def upload_avatar(current_user: Users, upload_file: UploadFile) -> dict:
        previous_profile = await UserService.get_user_profile(current_user.username)
        avatar_path = await save_uploaded_image(upload_file, AVATAR_DIR)
        await PersonRepository.update(current_user.person_id, profile=avatar_path)
        delete_uploaded_file_if_owned(previous_profile["profile"], AVATAR_DIR, {"default.png"})
        return await UserService.get_user_profile(current_user.username)

    @staticmethod
    async def delete_avatar(current_user: Users) -> dict:
        previous_profile = await UserService.get_user_profile(current_user.username)
        await PersonRepository.update(current_user.person_id, profile=DEFAULT_AVATAR_PATH)
        delete_uploaded_file_if_owned(previous_profile["profile"], AVATAR_DIR, {"default.png"})
        return await UserService.get_user_profile(current_user.username)

    @staticmethod
    async def get_public_author_profile(username: str) -> dict:
        user = await UsersRepository.find_by_username(username)
        if user is None:
            raise HTTPException(status_code=404, detail="Author not found!")

        profile = await UserService.get_user_profile(username)
        _, published_count = await PostRepository.list_posts(
            page=1, page_size=1, author_username=username, status=PostStatus.PUBLISHED)

        return {
            "username": profile["username"],
            "name": profile["name"],
            "bio": profile["bio"],
            "avatar": profile["profile"],
            "social_github": profile["social_github"],
            "social_linkedin": profile["social_linkedin"],
            "social_twitter": profile["social_twitter"],
            "social_website": profile["social_website"],
            "joined_at": user.created_at,
            "post_count": published_count,
        }

    @staticmethod
    async def list_popular_authors(limit: int = 6) -> list:
        rows = await PostRepository.popular_authors(limit)
        result = []
        for user, post_count in rows:
            person = user.person
            result.append({
                "username": user.username,
                "name": person.name if person else user.username,
                "avatar": person.profile if person else None,
                "post_count": post_count,
            })
        return result
