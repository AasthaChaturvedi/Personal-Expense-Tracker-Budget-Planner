document.addEventListener("DOMContentLoaded", () => {


  const monthFilter = document.getElementById("month");
  const categoryFilter = document.getElementById("category");

  const incomeEl = document.getElementById("report-income");
  const expenseEl = document.getElementById("report-expense");
  const savingsEl = document.getElementById("report-savings");
  const topCategoryEl = document.getElementById("top-category");

  const tableBody = document.getElementById("reports-table-body");

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  let categoryChart;
  let incomeExpenseChart;

  const today = new Date();
    monthFilter.value = today.toISOString().slice(0, 7);

  // ===== FILTER & UPDATE =====
  function updateReports() {
    const selectedMonth = monthFilter.value; // yyyy-mm
    const selectedCategory = categoryFilter.value;

    let filtered = transactions.filter(txn => {

      const txnMonth = txn.date.slice(0, 7);

      const matchMonth = selectedMonth ? txnMonth === selectedMonth : true;
      const matchCategory =
        selectedCategory === "all" || txn.category === selectedCategory;

      return matchMonth && matchCategory;
    });

    calculateSummary(filtered);
    renderTable(filtered);
  }

  // ===== SUMMARY CALCULATIONS =====
  function calculateSummary(data) {
    let income = 0;
    let expense = 0;
    let categoryTotals = {};

    data.forEach(txn => {
      if (txn.type === "income") {
        income += txn.amount;
      } else {
        expense += txn.amount;

        categoryTotals[txn.category] =
          (categoryTotals[txn.category] || 0) + txn.amount;
      }
    });

    incomeEl.textContent = `₹${income}`;
    expenseEl.textContent = `₹${expense}`;
    savingsEl.textContent = `₹${income - expense}`;

    // Top category
    let topCategory = "—";
    let max = 0;

    for (let cat in categoryTotals) {
      if (categoryTotals[cat] > max) {
        max = categoryTotals[cat];
        topCategory = cat;
      }
    }

    topCategoryEl.textContent = topCategory;
  }

  // ===== TABLE RENDER =====
  function renderTable(data) {
    tableBody.innerHTML = "";

    if (data.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;">No records found</td>
        </tr>
      `;
      return;
    }

    data.forEach(txn => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${txn.date}</td>
        <td>${txn.category}</td>
        <td>${txn.type}</td>
        <td>₹${txn.amount}</td>
        <td>${txn.note || ""}</td>
      `;

      tableBody.appendChild(row);
    });
  }

  function renderCharts(data) {

  // ===== CATEGORY DATA =====
  const categoryTotals = {};

  data.forEach(txn => {
    if (txn.type === "expense") {
      categoryTotals[txn.category] =
        (categoryTotals[txn.category] || 0) + txn.amount;
    }
  });

  const categoryLabels = Object.keys(categoryTotals);
  const categoryValues = Object.values(categoryTotals);

  // Destroy old chart (important!)
  if (categoryChart) categoryChart.destroy();

  categoryChart = new Chart(
    document.getElementById("categoryChart"),
    {
      type: "doughnut",
      data: {
        labels: categoryLabels,
        datasets: [{
          data: categoryValues
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom"
          }
        }
      }
    }
  );

  // ===== INCOME vs EXPENSE =====
  let income = 0;
  let expense = 0;

  data.forEach(txn => {
    if (txn.type === "income") income += txn.amount;
    else expense += txn.amount;
  });

  if (incomeExpenseChart) incomeExpenseChart.destroy();

  incomeExpenseChart = new Chart(
    document.getElementById("incomeExpenseChart"),
    {
      type: "bar",
      data: {
        labels: ["Income", "Expense"],
        datasets: [{
          data: [income, expense]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    }
  );
}


  // ===== EVENTS =====
  monthFilter.addEventListener("change", updateReports);
  categoryFilter.addEventListener("change", updateReports);

  // Initial load
  updateReports();
  renderCharts(filtered);
  calculateSummary(filtered);
  renderTable(filtered);
});
