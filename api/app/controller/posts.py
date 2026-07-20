from typing import Optional

from fastapi import APIRouter, Depends, File, Query, UploadFile

from app.dependencies import get_current_user
from app.model import Users
from app.schema import PostCreate, PostUpdate, ResponseSchema
from app.service.post import PostService

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.post("/upload-image", response_model=ResponseSchema, response_model_exclude_none=True)
async def upload_cover_image(file: UploadFile = File(...), current_user: Users = Depends(get_current_user)):
    path = await PostService.upload_cover_image(file)
    return ResponseSchema(detail="Successfully uploaded image!", result={"path": path})


@router.get("/", response_model=ResponseSchema, response_model_exclude_none=True)
async def list_posts(
    page: int = Query(1, ge=1),
    page_size: int = Query(9, ge=1, le=50),
    category: Optional[str] = None,
    author: Optional[str] = None,
    search: Optional[str] = None,
    featured: Optional[bool] = None,
):
    result = await PostService.list_posts(page, page_size, category, author, search, featured)
    return ResponseSchema(detail="Successfully fetch data!", result=result)


@router.get("/me", response_model=ResponseSchema, response_model_exclude_none=True)
async def list_my_posts(
    page: int = Query(1, ge=1),
    page_size: int = Query(9, ge=1, le=50),
    current_user: Users = Depends(get_current_user),
):
    result = await PostService.list_my_posts(current_user, page, page_size)
    return ResponseSchema(detail="Successfully fetch data!", result=result)


@router.get("/id/{post_id}", response_model=ResponseSchema, response_model_exclude_none=True)
async def get_post_for_edit(post_id: str, current_user: Users = Depends(get_current_user)):
    result = await PostService.get_by_id_for_owner(post_id, current_user)
    return ResponseSchema(detail="Successfully fetch data!", result=result)


@router.get("/{slug}", response_model=ResponseSchema, response_model_exclude_none=True)
async def get_post(slug: str):
    result = await PostService.get_by_slug_public(slug)
    return ResponseSchema(detail="Successfully fetch data!", result=result)


@router.get("/{slug}/related", response_model=ResponseSchema, response_model_exclude_none=True)
async def get_related_posts(slug: str, limit: int = Query(3, ge=1, le=10)):
    result = await PostService.get_related(slug, limit)
    return ResponseSchema(detail="Successfully fetch data!", result=result)


@router.post("/", response_model=ResponseSchema, response_model_exclude_none=True)
async def create_post(request_body: PostCreate, current_user: Users = Depends(get_current_user)):
    result = await PostService.create_post(current_user, request_body)
    return ResponseSchema(detail="Successfully created post!", result=result)


@router.patch("/{post_id}", response_model=ResponseSchema, response_model_exclude_none=True)
async def update_post(post_id: str, request_body: PostUpdate, current_user: Users = Depends(get_current_user)):
    result = await PostService.update_post(post_id, current_user, request_body)
    return ResponseSchema(detail="Successfully updated post!", result=result)


@router.delete("/{post_id}", response_model=ResponseSchema, response_model_exclude_none=True)
async def delete_post(post_id: str, current_user: Users = Depends(get_current_user)):
    await PostService.delete_post(post_id, current_user)
    return ResponseSchema(detail="Successfully deleted post!")
