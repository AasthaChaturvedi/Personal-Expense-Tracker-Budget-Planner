document.addEventListener("DOMContentLoaded", () => {

  // ====== DOM ELEMENTS ======
  const balanceAmount = document.getElementById("balance-amount");
  const incomeAmount = document.getElementById("income-amount");
  const expenseAmount = document.getElementById("expense-amount");
  const investmentAmount = document.getElementById("investment-amount");
  const categoryInput = document.getElementById("category");
  const form = document.getElementById("transaction-form");
  if (form) { 
    form.addEventListener("submit", e => e.preventDefault());
  } // Exit if form is not present (e.g., on reports page)
  const textInput = document.getElementById("text");
  const amountInput = document.getElementById("amount");
  const list = document.getElementById("transaction-list");
  const page = document.body.id;
  console.log("Current Page:", page);

  // ====== DESCRIPTION SUGGESTIONS ======
  const suggestionButtons = document.querySelectorAll(".description-suggestions button");

suggestionButtons.forEach(button => {
  button.addEventListener("click", () => {

    // remove active state
    suggestionButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    // fill description
    if (textInput) textInput.value = button.dataset.text;
if (categoryInput && button.dataset.category) {
  categoryInput.value = button.dataset.category;
}
if (amountInput) amountInput.focus();
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

  const budgetInputs = document.querySelectorAll(".budget-item input");

if (budgetInputs.length > 0) {
  budgetInputs.forEach(input => {
    const category = input.dataset.category;

    if (budgets[category]) {
      input.value = budgets[category];
    }

    input.addEventListener("input", () => {
      budgets[category] = Number(input.value);
      saveBudgets();
      updateBudgetsUI();
    });
  });
}

}

  // ====== RENDER TRANSACTIONS ======
  function renderTransactions() {
  if (!list) return;

  list.innerHTML = "";

  let balance = 0;
  let income = 0;
  let expense = 0;
  let investment = 0;

  transactions.forEach(transaction => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>
        ${transaction.text}
        <small class="category-tag">${transaction.category}</small>
      </span>
      <span>₹${transaction.amount}</span>
      <button class="delete-btn">❌</button>
    `;

    li.querySelector(".delete-btn").addEventListener("click", () => {
      transactions = transactions.filter(t => t.id !== transaction.id);
      saveTransactions();
      renderTransactions();
    });

    list.appendChild(li);

    balance += transaction.amount;

    if (transaction.amount > 0) {
      income += transaction.amount;
    } else {
      expense += Math.abs(transaction.amount);
      if (transaction.category === "investment") {
        investment += Math.abs(transaction.amount);
      }
    }
  });

  if (balanceAmount) balanceAmount.innerText = `₹${balance}`;
  if (incomeAmount) incomeAmount.innerText = `₹${income}`;
  if (expenseAmount) expenseAmount.innerText = `₹${expense}`;
  if (investmentAmount) investmentAmount.innerText = `₹${investment}`;
}


  // ====== ADD TRANSACTION ======
  if (form) form.addEventListener("submit", e => {
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
      category: categoryInput.value || "others"
    };

    transactions.push(transaction);
    saveTransactions();
    renderTransactions();
    form.reset();
    selectedType = "expense";
    suggestionButtons.forEach(btn => btn.classList.remove("active"));
  });

  // ====== INITIAL LOAD ======
  if (page === "dashboard" || page === "transactions") {
  renderTransactions();
}

if (page === "budget") {
  updateBudgetsUI();
}

  renderTransactions();
  updateBudgetsUI();

});
