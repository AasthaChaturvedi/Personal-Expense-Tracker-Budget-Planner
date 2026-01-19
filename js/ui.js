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

  animateNumber(incomeEl, 0, data.income);
  animateNumber(expenseEl, 0, data.expense);
  animateNumber(investmentEl, 0, data.investment);
  animateNumber(balanceEl, 0, data.balance);
  // Animate balance pulse
  balanceEl.classList.remove("pulse"); // reset if already applied
  void balanceEl.offsetWidth;          // force reflow (important)
  balanceEl.classList.add("pulse");

  setTimeout(() => {
    balanceEl.classList.remove("pulse");
  }, 600);

}

export function renderTransactions() {
  const list = document.getElementById("transaction-list");
  if (!list) return;

  list.innerHTML = "";

  const transactions = getTransactions();

  transactions.forEach(t => {
    const li = document.createElement("li");
    li.className = "transaction-item";

    if (t.category === "income") {
  li.classList.add("income");
} else if (t.category === "investment") {
  li.classList.add("investment");
} else {
  li.classList.add("expense");
}


    li.innerHTML = `
    <div>
      <span>${t.description}</span><br>
      <small>${formatDateTime(t.timestamp)}</small>
    </div>

      <span>₹${Math.abs(t.amount)}</span>
      <button class="edit-btn">✏️</button>
      <button class="delete-btn">❌</button>
    `;
    
    // EDIT
li.querySelector(".edit-btn").addEventListener("click", () => {
  document.dispatchEvent(
    new CustomEvent("edit-transaction", { detail: t })
  );
});

// DELETE
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

      // RESET COLORS
      fill.classList.remove("safe", "warning", "danger");

      // COLOR BASED ON USAGE
      if (percent <= 50) {
        fill.classList.add("safe");
      } else if (percent <= 80) {
        fill.classList.add("warning");
      } else {
        fill.classList.add("danger");
      }
          text.style.color =
      percent <= 50 ? "#2e7d32" :
      percent <= 80 ? "#f9a825" :
      "#c62828";


      text.textContent = `₹${spent} / ₹${budget}`;

  });
}
function animateNumber(element, start, end, duration = 800) {
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);

    element.textContent = `₹${value}`;

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}
// DATE FORMATTING UTILITY
function formatDateTime(iso) {
  const date = new Date(iso);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}
