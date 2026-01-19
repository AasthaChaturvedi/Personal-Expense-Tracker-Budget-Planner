
// storage.js
const TRANSACTION_KEY = "transactions";
const BUDGET_KEY = "budgets";

export function getTransactions() {
  return JSON.parse(localStorage.getItem(TRANSACTION_KEY)) || [];
}

export function saveTransactions(transactions) {
  localStorage.setItem(TRANSACTION_KEY, JSON.stringify(transactions));
}

export function getBudgets() {
  return JSON.parse(localStorage.getItem(BUDGET_KEY)) || {};
}

export function saveBudgets(budgets) {
  localStorage.setItem(BUDGET_KEY, JSON.stringify(budgets));
}
// ===== STORAGE UTIL =====
const Storage = {
  getTransactions() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
  },

  saveTransactions(transactions) {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }
};
