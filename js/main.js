// MAIN JS FILE
import { addTransaction } from "./transaction.js";
import { updateDashboardUI, renderTransactions, updateBudgetUI } from "./ui.js";
import { updateBudget } from "./budget.js";
// NAVBAR (runs on every page safely)
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

      addTransaction({
        id: Date.now(),
        description: text,
        category,
        amount,
        timestamp: new Date().toISOString()
      });

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
// RESPONSIVE NAVBAR TOGGLE
// MOBILE NAV TOGGLE
