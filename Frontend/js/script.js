let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

let balance = 0;
const balanceAmount = document.getElementById("balance-amount");
const form = document.getElementById("transaction-form");
const list = document.getElementById("transaction-list");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const text = document.getElementById("text").value;
  const amount = document.getElementById("amount").value;

  if (text === "" || amount === "") {
    alert("Please enter valid details");
    return;
  }

  const transactionAmount = Number(amount);
  balance += transactionAmount;
  const transaction = {
  id: Date.now(),
  text: text,
  amount: transactionAmount
};

transactions.push(transaction);
saveTransactions();


  balanceAmount.innerText = `₹${balance}`;

 const li = document.createElement("li");
li.innerHTML = `
  ${text} : ₹${transactionAmount}
  <button class="delete-btn">❌</button>
`;

if (transactionAmount < 0) {
  li.style.color = "red";
} else {
  li.style.color = "green";
}

const deleteBtn = li.querySelector(".delete-btn");

deleteBtn.addEventListener("click", function () {
  balance -= transaction.amount;
  balanceAmount.innerText = `₹${balance}`;

  transactions = transactions.filter(t => t.id !== transaction.id);
  saveTransactions();

  li.remove();
});


list.appendChild(li);


  form.reset();
});

function renderTransactions() {
  list.innerHTML = "";
  balance = 0;

  transactions.forEach(transaction => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${transaction.text} : ₹${transaction.amount}
      <button class="delete-btn">❌</button>
    `;

    li.style.color = transaction.amount < 0 ? "red" : "green";

    const deleteBtn = li.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", function () {
      balance -= transaction.amount;
      balanceAmount.innerText = `₹${balance}`;

      transactions = transactions.filter(t => t.id !== transaction.id);
      saveTransactions();
      renderTransactions();
    });

    list.appendChild(li);
    balance += transaction.amount;
  });

  balanceAmount.innerText = `₹${balance}`;
}
renderTransactions();
