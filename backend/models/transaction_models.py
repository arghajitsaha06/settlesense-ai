from typing import Optional, Dict, Any, List
from pydantic import BaseModel


class TransactionResponse(BaseModel):
    transaction_id: str
    status: str
    confidence: str

    amount: Optional[float] = None
    transaction_type: Optional[str] = None
    transaction_date: Optional[str] = None

    gateway: Optional[Dict[str, Any]] = None
    bank: Optional[Dict[str, Any]] = None
    ledger: Optional[Dict[str, Any]] = None

    exceptions: List[str] = []