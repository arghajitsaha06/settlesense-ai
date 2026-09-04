import pandas as pd
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"


gateway_df = pd.read_csv(DATA_DIR / "gateway.csv")
bank_df = pd.read_csv(DATA_DIR / "bank.csv")
ledger_df = pd.read_csv(DATA_DIR / "ledger.csv")


def get_record(df, transaction_id):
    records = df[df["transaction_id"] == transaction_id]

    if records.empty:
        return None

    record = records.iloc[0].to_dict()

    for key, value in record.items():
        if pd.isna(value):
            record[key] = None

    return record


def determine_status(
    gateway,
    bank,
    ledger,
    exceptions
):
    # Gateway failed
    if gateway is not None:
        if gateway["payment_status"] == "FAILED":
            return "FAILED"

    # Any reconciliation problem
    if exceptions:
        return "EXCEPTION"

    # Fully reconciled transaction
    if (
        gateway is not None
        and bank is not None
        and ledger is not None
    ):
        if (
            gateway["payment_status"] == "SUCCESS"
            and bank["settlement_status"] == "SETTLED"
            and ledger["ledger_status"] == "COMPLETED"
        ):
            return "SUCCESS"

    # Pending in bank
    if bank is not None:
        if bank["settlement_status"] == "PENDING":
            return "PENDING"

    # Pending in ledger
    if ledger is not None:
        if ledger["ledger_status"] == "PENDING":
            return "PENDING"

    # Reversed transaction
    if gateway is not None:
        if gateway["payment_status"] == "REVERSED":
            return "REVERSED"

    return "EXCEPTION"


def determine_confidence(
    gateway,
    bank,
    ledger,
    exceptions
):
    if (
        gateway is not None
        and bank is not None
        and ledger is not None
        and not exceptions
    ):
        return "HIGH"

    if exceptions:
        return "MEDIUM"

    return "LOW"


def find_transaction(transaction_id):

    gateway_data = get_record(
        gateway_df,
        transaction_id
    )

    bank_data = get_record(
        bank_df,
        transaction_id
    )

    ledger_data = get_record(
        ledger_df,
        transaction_id
    )

    # Transaction doesn't exist anywhere
    if (
        gateway_data is None
        and bank_data is None
        and ledger_data is None
    ):
        return None

    exceptions = []

    # Missing records
    if gateway_data is None:
        exceptions.append(
            "Gateway record is missing"
        )

    if bank_data is None:
        exceptions.append(
            "Bank settlement record is missing"
        )

    if ledger_data is None:
        exceptions.append(
            "Ledger record is missing"
        )

    # Amount reconciliation
    amounts = []

    if gateway_data is not None:
        amounts.append(
            gateway_data["amount"]
        )

    if bank_data is not None:
        amounts.append(
            bank_data["amount"]
        )

    if ledger_data is not None:
        amounts.append(
            ledger_data["amount"]
        )

    if len(set(amounts)) > 1:
        exceptions.append(
            "Amount mismatch detected between systems"
        )

    status = determine_status(
        gateway_data,
        bank_data,
        ledger_data,
        exceptions
    )

    confidence = determine_confidence(
        gateway_data,
        bank_data,
        ledger_data,
        exceptions
    )

    # Common transaction information
    amount = None
    transaction_type = None
    transaction_date = None

    if gateway_data is not None:
        amount = gateway_data["amount"]
        transaction_type = gateway_data["payment_method"]
        transaction_date = gateway_data["payment_date"]

    elif bank_data is not None:
        amount = bank_data["amount"]
        transaction_date = bank_data["settlement_date"]

    elif ledger_data is not None:
        amount = ledger_data["amount"]
        transaction_date = ledger_data["entry_date"]

    return {
        "transaction_id": transaction_id,
        "status": status,
        "confidence": confidence,
        "amount": amount,
        "transaction_type": transaction_type,
        "transaction_date": transaction_date,
        "channel": None,
        "is_fraud": False,
        "source": "reconciliation",
        "gateway": gateway_data,
        "bank": bank_data,
        "ledger": ledger_data,
        "exceptions": exceptions
    }


def get_all_transactions():

    transaction_ids = pd.concat([
        gateway_df["transaction_id"],
        bank_df["transaction_id"],
        ledger_df["transaction_id"]
    ]).drop_duplicates().tolist()

    transactions = []

    for transaction_id in transaction_ids:

        result = find_transaction(
            transaction_id
        )

        if result is not None:
            transactions.append(result)

    return transactions