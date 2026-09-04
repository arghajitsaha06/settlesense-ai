import pandas as pd
from pathlib import Path


# Get the backend folder path
BASE_DIR = Path(__file__).resolve().parent.parent

# Get the data folder path
DATA_DIR = BASE_DIR / "data"


# Load the three CSV files
gateway_df = pd.read_csv(DATA_DIR / "gateway.csv")
bank_df = pd.read_csv(DATA_DIR / "bank.csv")
ledger_df = pd.read_csv(DATA_DIR / "ledger.csv")


def get_record(df, transaction_id):
    """
    Find a transaction in a DataFrame.
    Returns the first matching transaction as a dictionary.
    Returns None if the transaction is not found.
    """

    records = df[df["transaction_id"] == transaction_id]

    if records.empty:
        return None

    record = records.iloc[0].to_dict()

    # Convert Pandas NaN values to Python None
    for key, value in record.items():
        if pd.isna(value):
            record[key] = None

    return record


def determine_status(gateway, bank, ledger, exceptions):
    """
    Determine the overall status of a transaction.
    """

    # Gateway failure takes priority
    if gateway is not None:
        if gateway["payment_status"] == "FAILED":
            return "FAILED"

    # Data inconsistencies require investigation
    if exceptions:
        return "EXCEPTION"

    # All three systems confirm successful settlement
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
            return "SETTLED"

    # Settlement is still in progress
    if bank is not None:
        if bank["settlement_status"] == "PENDING":
            return "PENDING"

    if ledger is not None:
        if ledger["ledger_status"] == "PENDING":
            return "PENDING"

    return "EXCEPTION"


def determine_confidence(
    gateway,
    bank,
    ledger,
    exceptions
):
    """
    Determine how reliable the transaction result is.
    """

    # Complete and consistent records
    if (
        gateway is not None
        and bank is not None
        and ledger is not None
        and not exceptions
    ):
        return "HIGH"

    # Some information is missing or inconsistent
    if exceptions:
        return "MEDIUM"

    # Fewer systems are available
    return "LOW"


def find_transaction(transaction_id):
    """
    Search for a transaction across Gateway, Bank and Ledger.
    """

    # Search all three systems
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

    # Transaction does not exist anywhere
    if (
        gateway_data is None
        and bank_data is None
        and ledger_data is None
    ):
        return None

    # Store detected problems
    exceptions = []

    # Check for missing records
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

    # Collect available amounts
    amounts = []

    if gateway_data is not None:
        amounts.append(gateway_data["amount"])

    if bank_data is not None:
        amounts.append(bank_data["amount"])

    if ledger_data is not None:
        amounts.append(ledger_data["amount"])

    # Check amount mismatch
    if len(set(amounts)) > 1:
        exceptions.append(
            "Amount mismatch detected between systems"
        )

    # Determine status
    status = determine_status(
        gateway_data,
        bank_data,
        ledger_data,
        exceptions
    )

    # Determine confidence
    confidence = determine_confidence(
        gateway_data,
        bank_data,
        ledger_data,
        exceptions
    )

    # Return combined information
    return {
        "transaction_id": transaction_id,
        "status": status,
        "confidence": confidence,
        "gateway": gateway_data,
        "bank": bank_data,
        "ledger": ledger_data,
        "exceptions": exceptions
    }
def get_all_transactions():
    """
    Get all unique transactions from Gateway, Bank and Ledger.
    """

    transaction_ids = pd.concat([
        gateway_df["transaction_id"],
        bank_df["transaction_id"],
        ledger_df["transaction_id"]
    ]).drop_duplicates().tolist()

    transactions = []

    for transaction_id in transaction_ids:
        result = find_transaction(transaction_id)

        if result is not None:
            transactions.append(result)

    return transactions