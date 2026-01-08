document.addEventListener("DOMContentLoaded", () => {

  // ====== DOM ELEMENTS ======
  const balanceAmount = document.getElementById("balance-amount");
  const incomeAmount = document.getElementById("income-amount");
  const expenseAmount = document.getElementById("expense-amount");
  const investmentAmount = document.getElementById("investment-amount");

  const form = document.getElementById("transaction-form");
  const textInput = document.getElementById("text");
  const amountInput = document.getElementById("amount");
  const list = document.getElementById("transaction-list");

  // ====== DESCRIPTION SUGGESTIONS ======
  const suggestionButtons = document.querySelectorAll(".description-suggestions button");

suggestionButtons.forEach(button => {
  button.addEventListener("click", () => {

    // remove active class from all
    suggestionButtons.forEach(btn => btn.classList.remove("active"));

    // add active to clicked one
    button.classList.add("active");

    // fill input
    textInput.value = button.dataset.value;
    textInput.focus();

    // detect investment suggestion
    if (button.dataset.value.toLowerCase() === "investment") {
     selectedType = "investment";
    } else {
     selectedType = "expense";
    }
});
});


  // ====== LOAD DATA ======
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  
  // ====== SAVE TO LOCAL STORAGE ======
  function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }
let budgets = JSON.parse(localStorage.getItem("budgets")) || {};
  function saveBudgets() {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }
  document.querySelectorAll(".budget-item input").forEach(input => {
  const category = input.dataset.category;

  // load saved budget
  if (budgets[category]) {
    input.value = budgets[category];
  }

  input.addEventListener("input", () => {
    budgets[category] = Number(input.value);
    saveBudgets();
    updateBudgetsUI();
  });
});
function calculateSpendingByCategory() {
  const spending = {};

  transactions.forEach(t => {
    if (t.amount < 0) {
      spending[t.category] =
        (spending[t.category] || 0) + Math.abs(t.amount);
    }
  });

  return spending;
}
function updateBudgetsUI() {
  const spending = calculateSpendingByCategory();

  document.querySelectorAll(".budget-item").forEach(item => {
    const input = item.querySelector("input");
    const fill = item.querySelector(".budget-fill");
    const text = item.querySelector(".budget-text");

    const category = input.dataset.category;
    const budget = budgets[category];
    const used = spending[category] || 0;

    if (!budget) {
      fill.style.width = "0%";
      text.innerText = "No budget set";
      return;
    }

    const percent = Math.min((used / budget) * 100, 100);
    fill.style.width = percent + "%";

    if (percent < 70) fill.style.background = "green";
    else if (percent < 100) fill.style.background = "orange";
    else fill.style.background = "red";

    text.innerText = `₹${used} used of ₹${budget}`;
  });
}

  // ====== RENDER TRANSACTIONS ======
  function renderTransactions() {
    list.innerHTML = "";

    let balance = 0;
    let income = 0;
    let expense = 0;
    let investment = 0;

    transactions.forEach(transaction => {
      const li = document.createElement("li");

      li.innerHTML = `
        <span>${transaction.text}</span>
        <span>₹${transaction.amount}</span>
        <button class="delete-btn">❌</button>
      `;

      li.style.color = transaction.amount < 0 ? "red" : "green";

      li.querySelector(".delete-btn").addEventListener("click", () => {
        transactions = transactions.filter(t => t.id !== transaction.id);
        saveTransactions();
        renderTransactions();
      });

      list.appendChild(li);
      li.classList.add(transaction.amount < 0 ? "expense" : "income");

      balance += transaction.amount;

      if (transaction.amount > 0) {
        income += transaction.amount;
      } else {
        expense += Math.abs(transaction.amount);
        if (transaction.text.toLowerCase().includes("investment")) {
          investment += Math.abs(transaction.amount);
        }   
      }
    });

    balanceAmount.innerText = `₹${balance}`;
    incomeAmount.innerText = `₹${income}`;
    expenseAmount.innerText = `₹${expense}`;
    investmentAmount.innerText = `₹${investment}`;
  }

  // ====== ADD TRANSACTION ======
  form.addEventListener("submit", e => {
    e.preventDefault();
  
    suggestionButtons.forEach(btn => btn.classList.remove("active"));

    const text = textInput.value.trim();
    const amount = amountInput.value.trim();

    if (text === "" || amount === "") {
      alert("Please enter description and amount");
      return;
    }

    const transaction = {
      id: Date.now(),
      text: text,
      amount: Number(amount),
      type: selectedType
    };

    transactions.push(transaction);
    saveTransactions();
    renderTransactions();
    form.reset();
    selectedType = "expense";
    suggestionButtons.forEach(btn => btn.classList.remove("active"));
  });

  // ====== INITIAL LOAD ======
  renderTransactions();
  updateBudgetsUI();

});
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => console.log("Service Worker Registered"))
    .catch(err => console.log("SW failed", err));
}

