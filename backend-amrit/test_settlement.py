from logic.settlement_rules import determine_settlement_status


transactions = {
    "TXN001": {
        "gateway": {
            "amount": 5000,
            "payment_status": "SUCCESS"
        },
        "bank": {
            "amount": 5000,
            "settlement_status": "SETTLED"
        },
        "ledger": {
            "amount": 5000,
            "ledger_status": "COMPLETED"
        }
    },

    "TXN002": {
        "gateway": {
            "amount": 12000,
            "payment_status": "SUCCESS"
        },
        "bank": {
            "amount": 12000,
            "settlement_status": "PENDING"
        },
        "ledger": {
            "amount": 12000,
            "ledger_status": "PENDING"
        }
    },

    "TXN003": {
        "gateway": {
            "amount": 7500,
            "payment_status": "FAILED"
        },
        "bank": None,
        "ledger": {
            "amount": 7500,
            "ledger_status": "REJECTED"
        }
    },

    "TXN004": {
        "gateway": {
            "amount": 3000,
            "payment_status": "SUCCESS"
        },
        "bank": {
            "amount": 3500,
            "settlement_status": "SETTLED"
        },
        "ledger": None
    },

    "TXN005": {
        "gateway": {
            "amount": 8500,
            "payment_status": "SUCCESS"
        },
        "bank": None,
        "ledger": None
    },

    "TXN006": {
        "gateway": {
            "amount": 4500,
            "payment_status": "SUCCESS"
        },
        "bank": {
            "amount": 4500,
            "settlement_status": "SETTLED"
        },
        "ledger": {
            "amount": 4500,
            "ledger_status": "COMPLETED"
        }
    },

    "TXN007": {
        "gateway": {
            "amount": 15000,
            "payment_status": "SUCCESS"
        },
        "bank": {
            "amount": 15000,
            "settlement_status": "PENDING"
        },
        "ledger": {
            "amount": 15000,
            "ledger_status": "PENDING"
        }
    }
}


for transaction_id, data in transactions.items():

    result = determine_settlement_status(
        data["gateway"],
        data["bank"],
        data["ledger"]
    )

    print(transaction_id, "→", result)