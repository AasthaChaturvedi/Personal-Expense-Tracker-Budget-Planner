// ====== DOM ELEMENTS ======
const balanceAmount = document.getElementById("balance-amount");
const incomeAmount = document.getElementById("income-amount");
const expenseAmount = document.getElementById("expense-amount");

const form = document.getElementById("transaction-form");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");
const list = document.getElementById("transaction-list");

// ====== LOAD DATA ======
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// ====== SAVE TO LOCAL STORAGE ======
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// ====== RENDER TRANSACTIONS ======
function renderTransactions() {
  list.innerHTML = "";

  let balance = 0;
  let income = 0;
  let expense = 0;

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

    balance += transaction.amount;

    if (transaction.amount > 0) {
      income += transaction.amount;
    } else {
      expense += Math.abs(transaction.amount);
    }
  });

  balanceAmount.innerText = `₹${balance}`;
  incomeAmount.innerText = `₹${income}`;
  expenseAmount.innerText = `₹${expense}`;
}

// ====== ADD TRANSACTION ======
form.addEventListener("submit", e => {
  e.preventDefault();

  const text = textInput.value.trim();
  const amount = amountInput.value.trim();

  if (text === "" || amount === "") {
    alert("Please enter description and amount");
    return;
  }

  const transaction = {
    id: Date.now(),
    text: text,
    amount: Number(amount)
  };

  transactions.push(transaction);
  saveTransactions();
  renderTransactions();

  form.reset();
});

// ====== INITIAL LOAD ======
renderTransactions();
