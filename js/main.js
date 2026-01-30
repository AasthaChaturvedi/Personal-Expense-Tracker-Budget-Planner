// MAIN JS FILE
import { addTransaction, updateTransaction } from "./transaction.js";
import { updateDashboardUI, renderTransactions, updateBudgetUI } from "./ui.js";
import { updateBudget } from "./budget.js";

document.addEventListener("DOMContentLoaded", () => {
document.querySelectorAll(".budget-item input").forEach(input => {
  input.addEventListener("input", () => {
    const category = input.dataset.category;
    const amount = Number(input.value);

    updateBudget(category, amount);
    updateBudgetUI();
  });
});
});
// NAVBAR (runs on every page safely)
let editingTransactionId = null;
document.addEventListener("edit-transaction", (e) => {
  const t = e.detail;

  document.getElementById("text").value = t.description;
  document.getElementById("amount").value = Math.abs(t.amount);
  document.getElementById("category").value = t.category;

  editingTransactionId = t.id;
});

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      navLinks.classList.toggle("open");
    });
  }
});
// DASHBOARD PAGE SCRIPT
document.addEventListener("DOMContentLoaded", () => {

  updateDashboardUI();
  renderTransactions();
  updateBudgetUI();

  const form = document.getElementById("transaction-form");

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      const text = document.getElementById("text").value.trim();
      const category = document.getElementById("category").value;
      let amount = Number(document.getElementById("amount").value);

      if (!text || !amount) return;

      if (category !== "income" && category !== "investment") {
        amount = -Math.abs(amount);
      }

      if (editingTransactionId) {
        updateTransaction(editingTransactionId, {
          description: text,
          category,
          amount
        });
  editingTransactionId = null;
    } else {
      addTransaction({
        id: Date.now(),
        description: text,
        category,
        amount,
        timestamp: new Date().toISOString()
      });
    }

      form.reset();
      renderTransactions();
      updateDashboardUI();
      updateBudgetUI();
    });
  }

  // SUGGESTION BUTTONS
const textInput = document.getElementById("text");
const suggestionButtons = document.querySelectorAll(".description-suggestions button");

if (textInput && suggestionButtons.length > 0) {
  suggestionButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      textInput.value = btn.dataset.text;
    });
  });
}
});

// NAVBAR ACTIVE LINK HIGHLIGHTING
const currentPage = location.pathname.split("/").pop() || "index.html";

document.querySelectorAll("nav a").forEach(link => {
    const linkPage = link.getAttribute("href");
  if (linkPage === currentPage) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});
