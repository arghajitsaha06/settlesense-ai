from logic.data_loader import get_transaction


transaction = get_transaction("TXN001")

print("Transaction ID:", transaction["transaction_id"])

print("\nGateway:")
print(transaction["gateway"])

print("\nBank:")
print(transaction["bank"])

print("\nLedger:")
print(transaction["ledger"])