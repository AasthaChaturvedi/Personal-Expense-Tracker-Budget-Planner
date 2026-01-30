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
    .filter(t => {
      if (t.amount >= 0) return false; // Only consider expenses
      //If category is 'others', include all uncategorized expenses
      if (category === 'others') {
        return !['food', 'transportation', 'entertainment', 'utilities', 'health', 'shopping', 'investment', 'fixed monthly expense'].includes(t.category);
      }
      //For other categories, match exactly
      return t.category === category;
    })

    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}
