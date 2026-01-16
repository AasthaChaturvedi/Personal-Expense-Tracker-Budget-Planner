// ui.js
import { calculateDashboard } from "./dashboard.js";
import { getTransactions, getBudgets } from "./storage.js";
import { calculateCategoryExpense } from "./budget.js";
import { deleteTransaction } from "./transaction.js";

export function updateDashboardUI() {
  const data = calculateDashboard();

  const incomeEl = document.getElementById("income-amount");
  const expenseEl = document.getElementById("expense-amount");
  const investmentEl = document.getElementById("investment-amount");
  const balanceEl = document.getElementById("balance-amount");

  if (!incomeEl) return; // safety for other pages

  incomeEl.textContent = `₹${data.income}`;
  expenseEl.textContent = `₹${data.expense}`;
  investmentEl.textContent = `₹${data.investment}`;
  balanceEl.textContent = `₹${data.balance}`;
}

export function renderTransactions() {
  const list = document.getElementById("transaction-list");
  if (!list) return;

  list.innerHTML = "";

  const transactions = getTransactions();

  transactions.forEach(t => {
    const li = document.createElement("li");
    li.className = "transaction-item";

    if (t.amount >= 0) {
      li.classList.add("income");
    } else {
      li.classList.add("expense");
    }

    li.innerHTML = `
      <span>${t.text}</span>
      <span>₹${Math.abs(t.amount)}</span>
      <button class="delete-btn">❌</button>
    `;

    li.querySelector(".delete-btn").addEventListener("click", () => {
      deleteTransaction(t.id);
      renderTransactions();
      updateDashboardUI();
      updateBudgetUI();
    });

    list.appendChild(li);
  });
}

export function updateBudgetUI() {
  const budgets = getBudgets();

  document.querySelectorAll(".budget-item").forEach(item => {
    const input = item.querySelector("input");
    const fill = item.querySelector(".budget-fill");
    const text = item.querySelector(".budget-text");

    if (!input) return;

    const category = input.dataset.category;
    const budget = budgets[category] || 0;
    const spent = calculateCategoryExpense(category);

    const percent = budget ? Math.min((spent / budget) * 100, 100) : 0;

    fill.style.width = percent + "%";
    text.textContent = `₹${spent} / ₹${budget}`;
  });
}
