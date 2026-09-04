from logic.transaction_service import analyze_transaction


transaction_ids = [
    "TXN001",
    "TXN002",
    "TXN003",
    "TXN004",
    "TXN005",
    "TXN006",
    "TXN007"
]


for transaction_id in transaction_ids:

    transaction = analyze_transaction(transaction_id)

    print("\n==============================")
    print("Transaction ID:", transaction["transaction_id"])
    print("Status:", transaction["status"])
    print("Confidence:", transaction["confidence"])

    print("\nTimeline:")

    for event in transaction["timeline"]:
        print(
            f'{event["stage"]} → '
            f'{event["status"]} → '
            f'₹{event["amount"]} → '
            f'{event["date"]}'
        )

    print("\nExceptions:")
    print(transaction["exceptions"])