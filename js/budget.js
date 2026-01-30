// budget.js
import { getBudgets, saveBudgets, getTransactions } from "./storage.js";

export function updateBudget(category, amount) {
  const budgets = getBudgets();
  budgets[category] = Number(amount);
  saveBudgets(budgets);
}

export function calculateCategoryExpense(category) {
  const transactions = getTransactions();

  return transactions
    .filter(t => t.category === category && t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}
