// dashboard.js


import { getTransactions } from "./storage.js";

export function calculateDashboard() {
  const transactions = getTransactions();

  let income = 0;
  let expense = 0;
  let investment = 0;

  transactions.forEach(t => {
    if (t.category === "income") {
      income += t.amount;
    } else if (t.category === "investment") {
      investment += Math.abs(t.amount);
    } else {
      expense += Math.abs(t.amount);
    }
  });

  return {
    income,
    expense,
    investment,
    balance: income - expense - investment
  };

}

