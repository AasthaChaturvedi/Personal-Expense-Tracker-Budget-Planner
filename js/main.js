import { addTransaction } from "./transaction.js";
import { updateDashboardUI, renderTransactions, updateBudgetUI } from "./ui.js";
import { updateBudget } from "./budget.js";

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
        text,
        category,
        amount
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
