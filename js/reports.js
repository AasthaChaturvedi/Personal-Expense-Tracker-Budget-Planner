import { getTransactions } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const monthInput = document.getElementById("month");
  const categorySelect = document.getElementById("report-category");

  const incomeEl = document.getElementById("report-income");
  const expenseEl = document.getElementById("report-expense");
  const savingsEl = document.getElementById("report-savings");
  const topCategoryEl = document.getElementById("top-category");
  const tableBody = document.getElementById("reports-table-body");

  if (!tableBody) return;

  function renderReports() {
    const transactions = getTransactions();

    const selectedMonth = monthInput.value;
    const selectedCategory = categorySelect.value;

    let income = 0;
    let expense = 0;
    const categoryTotals = {};

    tableBody.innerHTML = "";

    transactions.forEach(t => {
      // Month filter
      if (selectedMonth && !t.date.startsWith(selectedMonth)) return;

      // Category filter
      if (selectedCategory !== "all" && t.category !== selectedCategory) return;

      // Totals
      if (t.amount > 0) income += t.amount;
      else expense += Math.abs(t.amount);

      if (t.amount < 0) {
  categoryTotals[t.category] =
    (categoryTotals[t.category] || 0) + Math.abs(t.amount);
    }
      // Table row
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${t.date}</td>
        <td>${t.category}</td>
        <td>${t.amount > 0 ? "Income" : "Expense"}</td>
        <td>₹${Math.abs(t.amount)}</td>
        <td>${t.description}</td>
      `;
      tableBody.appendChild(row);
    });

    incomeEl.textContent = `₹${income}`;
    expenseEl.textContent = `₹${expense}`;
    savingsEl.textContent = `₹${income - expense}`;

    // Top category
    let top = "—";
    let max = 0;
    for (const cat in categoryTotals) {
      if (categoryTotals[cat] > max) {
        max = categoryTotals[cat];
        top = cat;
      }
    }
    topCategoryEl.textContent = top;
  }

  monthInput.addEventListener("change", renderReports);
  categorySelect.addEventListener("change", renderReports);

  renderReports();
});
