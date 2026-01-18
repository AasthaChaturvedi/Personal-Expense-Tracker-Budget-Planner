// transaction.js
import { getTransactions, saveTransactions } from "./storage.js";

export function addTransaction(transaction) {
  const transactions = getTransactions();
  transactions.push(transaction);
  saveTransactions(transactions);
}

export function deleteTransaction(id) {
  const transactions = getTransactions().filter(t => t.id !== id);
  saveTransactions(transactions);
}

const transactionForm = document.getElementById("transaction-form");
if (transactionForm) {
  transactionForm.addEventListener("submit", addTransaction);
}

