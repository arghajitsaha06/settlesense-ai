import os
import secrets

from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from passlib.context import CryptContext
from jose import jwt
from pymongo import MongoClient


load_dotenv()


# MongoDB configuration
MONGODB_URI = os.getenv(
    "MONGODB_URI",
    "mongodb://localhost:27017"
)

MONGODB_DATABASE = os.getenv(
    "MONGODB_DATABASE",
    "settlesense"
)


# MongoDB connection
client = MongoClient(MONGODB_URI)

db = client[MONGODB_DATABASE]

users_collection = db["users"]

reset_tokens_collection = db["password_reset_tokens"]


# JWT configuration
SECRET_KEY = "settlesense-development-secret-change-later"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


# Password hashing
pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)


def create_users_table():

    users_collection.create_index(
        "email",
        unique=True
    )

    reset_tokens_collection.create_index(
        "reset_token",
        unique=True
    )


def hash_password(password: str) -> str:

    return pwd_context.hash(
        password
    )


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:

    return pwd_context.verify(
        plain_password,
        hashed_password
    )


def get_user_by_email(email: str):

    user = users_collection.find_one(
        {
            "email": email.lower()
        }
    )

    return user


def create_user(
    name: str,
    email: str,
    password: str
):

    existing_user = get_user_by_email(
        email
    )

    if existing_user is not None:
        return None

    password_hash = hash_password(
        password
    )

    created_at = datetime.now(
        timezone.utc
    ).isoformat()

    user = {
        "name": name,
        "email": email.lower(),
        "password_hash": password_hash,
        "created_at": created_at
    }

    try:

        result = users_collection.insert_one(
            user
        )

    except Exception:

        return None

    return {
        "id": str(result.inserted_id),
        "name": name,
        "email": email.lower(),
        "created_at": created_at
    }


def create_access_token(
    user_id: str
):

    expire = datetime.now(
        timezone.utc
    ) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "exp": expire
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


def create_password_reset_token(
    user_id
):

    reset_token = secrets.token_urlsafe(
        32
    )

    created_at = datetime.now(
        timezone.utc
    )

    expires_at = created_at + timedelta(
        minutes=15
    )

    reset_tokens_collection.update_many(
        {
            "user_id": str(user_id),
            "used": False
        },
        {
            "$set": {
                "used": True
            }
        }
    )

    reset_token_document = {
        "user_id": str(user_id),
        "reset_token": reset_token,
        "expires_at": expires_at.isoformat(),
        "used": False,
        "created_at": created_at.isoformat()
    }

    reset_tokens_collection.insert_one(
        reset_token_document
    )

    return reset_token


def reset_password(
    email: str,
    reset_token: str,
    new_password: str
):

    user = get_user_by_email(
        email
    )

    if user is None:

        return (
            False,
            "Invalid reset request"
        )

    user_id = str(
        user["_id"]
    )

    token_document = (
        reset_tokens_collection.find_one(
            {
                "user_id": user_id,
                "reset_token": reset_token
            },
            sort=[
                ("created_at", -1)
            ]
        )
    )

    if token_document is None:

        return (
            False,
            "Invalid reset token"
        )

    if token_document.get("used") is True:

        return (
            False,
            "Reset token has already been used"
        )

    expires_at = datetime.fromisoformat(
        token_document["expires_at"]
    )

    current_time = datetime.now(
        timezone.utc
    )

    if current_time > expires_at:

        return (
            False,
            "Reset token has expired"
        )

    new_password_hash = hash_password(
        new_password
    )

    users_collection.update_one(
        {
            "_id": user["_id"]
        },
        {
            "$set": {
                "password_hash": new_password_hash
            }
        }
    )

    reset_tokens_collection.update_one(
        {
            "_id": token_document["_id"]
        },
        {
            "$set": {
                "used": True
            }
        }
    )

    return (
        True,
        "Password reset successfully"
    )