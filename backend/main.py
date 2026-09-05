from fastapi import FastAPI, HTTPException

from services.transaction_service import find_transaction
from models.transaction_models import TransactionResponse

from auth.auth_models import (
    SignupRequest,
    LoginRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    AuthResponse,
    ForgotPasswordResponse,
    ResetPasswordResponse
)

from auth.auth_service import (
    create_users_table,
    create_user,
    get_user_by_email,
    verify_password,
    create_access_token,
    create_password_reset_token,
    reset_password
)


app = FastAPI(
    title="SettleSense AI",
    description="Fintech Settlement Support Backend",
    version="1.0.0"
)


# Initialize MongoDB indexes
create_users_table()


@app.get("/")
def home():
    return {
        "message": "SettleSense AI Backend is running"
    }


# ============================================================
# SIGNUP
# ============================================================

@app.post(
    "/api/auth/signup",
    response_model=AuthResponse
)
def signup(request: SignupRequest):

    if len(request.password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters long"
        )

    user = create_user(
        name=request.name,
        email=request.email,
        password=request.password
    )

    if user is None:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists"
        )

    access_token = create_access_token(
        user["id"]
    )

    return {
        "message": "Account created successfully",
        "access_token": access_token,
        "token_type": "bearer"
    }


# ============================================================
# LOGIN
# ============================================================

@app.post(
    "/api/auth/login",
    response_model=AuthResponse
)
def login(request: LoginRequest):

    user = get_user_by_email(
        request.email
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    password_valid = verify_password(
        request.password,
        user["password_hash"]
    )

    if not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        str(user["_id"])
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }


# ============================================================
# FORGOT PASSWORD
# ============================================================

@app.post(
    "/api/auth/forgot-password",
    response_model=ForgotPasswordResponse
)
def forgot_password(request: ForgotPasswordRequest):

    user = get_user_by_email(
        request.email
    )

    if user is None:
        return {
            "message": (
                "If an account exists with this email, "
                "a password reset token has been generated."
            ),
            "reset_token": None
        }

    reset_token = create_password_reset_token(
        str(user["_id"])
    )

    return {
        "message": (
            "Password reset token generated. "
            "For development, use the returned token "
            "to reset your password."
        ),
        "reset_token": reset_token
    }


# ============================================================
# RESET PASSWORD
# ============================================================

@app.post(
    "/api/auth/reset-password",
    response_model=ResetPasswordResponse
)
def reset_password_endpoint(
    request: ResetPasswordRequest
):

    if len(request.new_password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters long"
        )

    success, message = reset_password(
        email=request.email,
        reset_token=request.reset_token,
        new_password=request.new_password
    )

    if not success:
        raise HTTPException(
            status_code=400,
            detail=message
        )

    return {
        "message": message
    }


# ============================================================
# TRANSACTION RECONCILIATION
# ============================================================

@app.get(
    "/api/transaction/{transaction_id}",
    response_model=TransactionResponse
)
def get_transaction(transaction_id: str):

    result = find_transaction(
        transaction_id
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    return result