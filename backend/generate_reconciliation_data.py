import pandas as pd
from pathlib import Path


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

SOURCE_FILE = DATA_DIR / "indian_banking_transactions.csv"

GATEWAY_FILE = DATA_DIR / "gateway.csv"
BANK_FILE = DATA_DIR / "bank.csv"
LEDGER_FILE = DATA_DIR / "ledger.csv"


# ============================================================
# LOAD KAGGLE DATASET
# ============================================================

print("Loading Kaggle dataset...")

df = pd.read_csv(SOURCE_FILE)

print(f"Total Kaggle transactions: {len(df)}")


# ============================================================
# COMMON TRANSACTION DATA
# ============================================================

common = pd.DataFrame()

common["transaction_id"] = df["transaction_id"]
common["amount"] = df["transaction_amount"]
common["transaction_date"] = df["transaction_date"]


# ============================================================
# GATEWAY DATA
# ============================================================

gateway = pd.DataFrame()

gateway["transaction_id"] = common["transaction_id"]
gateway["amount"] = common["amount"]

gateway["payment_status"] = (
    df["transaction_status"]
    .str.upper()
    .replace({
        "SUCCESS": "SUCCESS",
        "FAILED": "FAILED",
        "PENDING": "PENDING",
        "REVERSED": "REVERSED"
    })
)

gateway["payment_date"] = common["transaction_date"]

gateway["payment_method"] = df["transaction_type"]

gateway["gateway_reference"] = (
    "GW-" + df["transaction_id"].astype(str)
)


# ============================================================
# BANK DATA
# ============================================================

bank = pd.DataFrame()

bank["transaction_id"] = common["transaction_id"]
bank["amount"] = common["amount"]

# Derive bank settlement status
bank["settlement_status"] = (
    df["transaction_status"]
    .str.upper()
    .map({
        "SUCCESS": "SETTLED",
        "PENDING": "PENDING",
        "FAILED": "PENDING",
        "REVERSED": "REVERSED"
    })
    .fillna("PENDING")
)

# Successful transactions settle on the next date
bank["settlement_date"] = pd.to_datetime(
    df["transaction_date"],
    errors="coerce"
)

successful = (
    df["transaction_status"].str.upper() == "SUCCESS"
)

bank.loc[
    successful,
    "settlement_date"
] = (
    pd.to_datetime(
        df.loc[successful, "transaction_date"],
        errors="coerce"
    )
    + pd.Timedelta(days=1)
)

bank["settlement_date"] = (
    bank["settlement_date"]
    .dt.strftime("%Y-%m-%d")
)

bank["bank_reference"] = (
    "BK-" + df["transaction_id"].astype(str)
)


# ============================================================
# LEDGER DATA
# ============================================================

ledger = pd.DataFrame()

ledger["transaction_id"] = common["transaction_id"]
ledger["amount"] = common["amount"]

ledger["ledger_status"] = (
    df["transaction_status"]
    .str.upper()
    .map({
        "SUCCESS": "COMPLETED",
        "PENDING": "PENDING",
        "FAILED": "REJECTED",
        "REVERSED": "REVERSED"
    })
    .fillna("PENDING")
)

ledger["entry_date"] = common["transaction_date"]

ledger["ledger_reference"] = (
    "LD-" + df["transaction_id"].astype(str)
)


# ============================================================
# SAVE THREE CSV FILES
# ============================================================

print("Generating gateway.csv...")
gateway.to_csv(
    GATEWAY_FILE,
    index=False
)

print("Generating bank.csv...")
bank.to_csv(
    BANK_FILE,
    index=False
)

print("Generating ledger.csv...")
ledger.to_csv(
    LEDGER_FILE,
    index=False
)


# ============================================================
# SUMMARY
# ============================================================

print()
print("========================================")
print("RECONCILIATION DATA GENERATED")
print("========================================")

print(f"Gateway rows : {len(gateway)}")
print(f"Bank rows    : {len(bank)}")
print(f"Ledger rows  : {len(ledger)}")

print()
print("Files created:")

print(GATEWAY_FILE)
print(BANK_FILE)
print(LEDGER_FILE)

print()
print("Sample transaction:")
print()

sample_id = df.iloc[0]["transaction_id"]

print("Transaction ID:", sample_id)

print()
print("Gateway:")
print(
    gateway[
        gateway["transaction_id"] == sample_id
    ].to_string(index=False)
)

print()
print("Bank:")
print(
    bank[
        bank["transaction_id"] == sample_id
    ].to_string(index=False)
)

print()
print("Ledger:")
print(
    ledger[
        ledger["transaction_id"] == sample_id
    ].to_string(index=False)
)