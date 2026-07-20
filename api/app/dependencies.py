from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials

from app.model import Users
from app.repository.auth_repo import JWTBearer, JWTRepo
from app.repository.users import UsersRepository


async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(JWTBearer())) -> Users:
    token = JWTRepo.extract_token(credentials)
    user = await UsersRepository.find_by_username_with_roles(token["username"])
    if user is None:
        raise HTTPException(status_code=401, detail="User not found!")
    return user


def require_roles(*role_names: str):
    async def _check(user: Users = Depends(get_current_user)) -> Users:
        user_role_names = {role.role_name for role in user.roles}
        if not user_role_names.intersection(role_names):
            raise HTTPException(status_code=403, detail="You do not have permission to perform this action!")
        return user
    return _check


require_admin = require_roles("admin")
