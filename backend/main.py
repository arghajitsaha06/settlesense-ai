from fastapi import FastAPI, HTTPException

from services.transaction_service import find_transaction
from models.transaction_models import TransactionResponse


app = FastAPI(
    title="SettleSense AI",
    description="Fintech Settlement Support Backend",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "SettleSense AI Backend is running"
    }


@app.get(
    "/api/transaction/{transaction_id}",
    response_model=TransactionResponse
)
def get_transaction(transaction_id: str):

    result = find_transaction(transaction_id)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    return result