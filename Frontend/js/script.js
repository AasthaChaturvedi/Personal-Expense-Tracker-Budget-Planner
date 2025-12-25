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

  balanceAmount.innerText = `₹${balance}`;

  const li = document.createElement("li");
li.innerText = `${text} : ₹${transactionAmount}`;

if (transactionAmount < 0) {
  li.style.color = "red";
} else {
  li.style.color = "green";
}

list.appendChild(li);

  form.reset();
});
