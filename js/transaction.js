// transaction.js
import { getTransactions, saveTransactions } from "./storage.js";

export function addTransaction(transaction) {
  if (
    !transaction ||
    !transaction.description ||
    isNaN(transaction.amount)
  ) {
    return;
  }


  const transactions = getTransactions();
  transactions.push(transaction);
  saveTransactions(transactions);
}

export function deleteTransaction(id) {
  const transactions = getTransactions().filter(t => t.id !== id);
  saveTransactions(transactions);
}
export function updateTransaction(id, updatedData) {
  const transactions = getTransactions().map(t =>
    t.id === id ? { ...t, ...updatedData } : t
  );

  saveTransactions(transactions);
}


