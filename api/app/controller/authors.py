from fastapi import APIRouter, Query

from app.schema import ResponseSchema
from app.service.users import UserService

router = APIRouter(prefix="/authors", tags=["Authors"])


@router.get("/", response_model=ResponseSchema, response_model_exclude_none=True)
async def list_popular_authors(limit: int = Query(6, ge=1, le=50)):
    result = await UserService.list_popular_authors(limit)
    return ResponseSchema(detail="Successfully fetch data!", result=result)


@router.get("/{username}", response_model=ResponseSchema, response_model_exclude_none=True)
async def get_author(username: str):
    result = await UserService.get_public_author_profile(username)
    return ResponseSchema(detail="Successfully fetch data!", result=result)
