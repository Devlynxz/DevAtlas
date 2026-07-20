from fastapi import APIRouter, Depends, File, Security, UploadFile

from app.dependencies import get_current_user
from app.model import Users
from app.schema import ResponseSchema, RegisterSchema, LoginSchema, ForgotPasswordSchema, ProfileUpdateSchema
from app.repository.auth_repo import JWTBearer, JWTRepo
from fastapi.security import HTTPAuthorizationCredentials
from app.service.users import UserService

router = APIRouter(
    prefix="/users",
    tags=['user'],
    dependencies=[Depends(JWTBearer())]
)


@router.get("/", response_model=ResponseSchema, response_model_exclude_none=True)
async def get_user_profile(credentials: HTTPAuthorizationCredentials = Security(JWTBearer())):
    token = JWTRepo.extract_token(credentials)
    result = await UserService.get_user_profile(token['username'])
    return ResponseSchema(detail="Successfully fetch data!", result=result)


@router.patch("/me", response_model=ResponseSchema, response_model_exclude_none=True)
async def update_profile(request_body: ProfileUpdateSchema, current_user: Users = Depends(get_current_user)):
    result = await UserService.update_profile(current_user, request_body)
    return ResponseSchema(detail="Successfully updated profile!", result=result)


@router.post("/me/avatar", response_model=ResponseSchema, response_model_exclude_none=True)
async def upload_avatar(file: UploadFile = File(...), current_user: Users = Depends(get_current_user)):
    result = await UserService.upload_avatar(current_user, file)
    return ResponseSchema(detail="Successfully updated avatar!", result=result)


@router.delete("/me/avatar", response_model=ResponseSchema, response_model_exclude_none=True)
async def delete_avatar(current_user: Users = Depends(get_current_user)):
    result = await UserService.delete_avatar(current_user)
    return ResponseSchema(detail="Successfully removed avatar!", result=result)