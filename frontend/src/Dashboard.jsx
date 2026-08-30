import { useEffect, useState } from "react";
import AddTransaction from "./AddTransaction";
import AddBudget from "./AddBudget";
import AddAccount from "./AddAccount";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Dashboard({ onLogout }) {
  const [dashboard, setDashboard] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [editingAccount, setEditingAccount] = useState(null);
  const [editingTransaction, setEditingTransaction] =
    useState(null);
  const [error, setError] = useState("");

    useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Get accounts
        const accountsResponse = await fetch(
          "http://127.0.0.1:8000/accounts",
          { headers }
        );

        if (!accountsResponse.ok) {
          const data = await accountsResponse.json();
          setError(data.detail || "Failed to load accounts");
          return;
        }

        const accountsData = await accountsResponse.json();
        setAccounts(accountsData);

        // Get transactions
        const transactionsResponse = await fetch(
          "http://127.0.0.1:8000/transactions",
          { headers }
        );

        if (!transactionsResponse.ok) {
          const data = await transactionsResponse.json();
          setError(
            data.detail || "Failed to load transactions"
          );
          return;
        }

        const transactionsData =
          await transactionsResponse.json();

        // Calculate totals
        const totalBalance = accountsData.reduce(
          (sum, account) =>
            sum + Number(account.balance || 0),
          0
        );

        const totalIncome = transactionsData
          .filter((t) => t.type === "income")
          .reduce(
            (sum, t) => sum + Number(t.amount || 0),
            0
          );

        const totalExpense = transactionsData
          .filter((t) => t.type === "expense")
          .reduce(
            (sum, t) => sum + Number(t.amount || 0),
            0
          );

        // Spending by category
        const spendingByCategory = {};

        transactionsData
          .filter((t) => t.type === "expense")
          .forEach((t) => {
            const category = t.category || "Other";

            spendingByCategory[category] =
              (spendingByCategory[category] || 0) +
              Number(t.amount || 0);
          });

        // Most recent transactions
        const recentTransactions = [...transactionsData]
          .sort(
            (a, b) =>
              new Date(b.created_at || 0) -
              new Date(a.created_at || 0)
          )
          .slice(0, 10);

        setDashboard({
          total_balance: totalBalance,
          total_income: totalIncome,
          total_expense: totalExpense,
          spending_by_category: spendingByCategory,
          budgets: [],
          recent_transactions: recentTransactions,
        });
      } catch (err) {
        console.error(err);
        setError("Unable to connect to server");
      }
    };

    fetchDashboard();
  }, []);

  if (error) {
    return (
      <div className="error-page">
        {error}
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="loading">
        Loading dashboard...
      </div>
    );
  }

  /* =========================
     DASHBOARD CALCULATIONS
     ========================= */

  const totalIncome = Number(
    dashboard.total_income
  );

  const totalExpense = Number(
    dashboard.total_expense
  );

  const savingsRate =
    totalIncome > 0
      ? ((totalIncome - totalExpense) /
          totalIncome) *
        100
      : 0;

  const topCategory =
    Object.entries(
      dashboard.spending_by_category || {}
    ).sort(
      (a, b) =>
        Number(b[1]) - Number(a[1])
    )[0];

  const topCategoryName = topCategory
    ? topCategory[0]
    : "No spending yet";

  const topCategoryAmount = topCategory
    ? Number(topCategory[1])
    : 0;

  /* =========================
     CHART DATA
     ========================= */

  const spendingData = Object.entries(
    dashboard.spending_by_category || {}
  ).map(([category, amount]) => ({
    name: category,
    value: Number(amount),
  }));

  const incomeExpenseData = [
    {
      name: "Income",
      amount: totalIncome,
    },
    {
      name: "Expense",
      amount: totalExpense,
    },
  ];

  return (
    <div className="dashboard-page">

      {/* =========================
          HEADER
          ========================= */}

      <header className="dashboard-header">

        <div>
          <h1>FinTrack Pro</h1>

          <p>
            Personal Finance Dashboard
          </p>
        </div>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>

      </header>


      {/* =========================
          ADD TRANSACTION
          ========================= */}

      <AddTransaction
        accounts={accounts}
        onTransactionAdded={() => {
          window.location.reload();
        }}
      />


      {/* =========================
          ADD BUDGET
          ========================= */}

      <AddBudget
        onBudgetAdded={() => {
          window.location.reload();
        }}
      />


      {/* =========================
          ADD ACCOUNT
          ========================= */}

      <AddAccount
        onAccountAdded={() => {
          window.location.reload();
        }}
      />


      {/* =========================
          ACCOUNTS
          ========================= */}

      <section className="dashboard-card accounts-card">

        <h2>Accounts</h2>

        <div className="accounts-list">

          {accounts.map((account) => {

            const handleDeleteAccount =
              async () => {

                const confirmed =
                  window.confirm(
                    `Delete ${account.name} account?`
                  );

                if (!confirmed) {
                  return;
                }

                try {
                  const token =
                    localStorage.getItem(
                      "access_token"
                    );

                  const response =
                    await fetch(
                      `http://127.0.0.1:8000/accounts/${account.id}`,
                      {
                        method: "DELETE",
                        headers: {
                          Authorization:
                            `Bearer ${token}`,
                        },
                      }
                    );

                  if (!response.ok) {
                    const data =
                      await response.json();

                    alert(
                      data.detail ||
                        "Failed to delete account"
                    );

                    return;
                  }

                  window.location.reload();

                } catch {
                  alert(
                    "Unable to connect to server"
                  );
                }
              };

            return (
              <div
                className="account-item"
                key={account.id}
              >

                {editingAccount ===
                account.id ? (

                  /* EDIT ACCOUNT */

                  <div className="account-edit-form">

                    <input
                      type="text"
                      defaultValue={
                        account.name
                      }
                      id={`name-${account.id}`}
                    />

                    <select
                      defaultValue={
                        account.type
                      }
                      id={`type-${account.id}`}
                    >
                      <option value="Savings">
                        Savings
                      </option>

                      <option value="Checking">
                        Checking
                      </option>

                      <option value="Cash">
                        Cash
                      </option>

                      <option value="Credit Card">
                        Credit Card
                      </option>
                    </select>

                    <input
                      type="number"
                      step="0.01"
                      defaultValue={
                        account.balance
                      }
                      id={`balance-${account.id}`}
                    />

                    <select
                      defaultValue={
                        account.currency
                      }
                      id={`currency-${account.id}`}
                    >
                      <option value="INR">
                        INR
                      </option>

                      <option value="USD">
                        USD
                      </option>

                      <option value="EUR">
                        EUR
                      </option>
                    </select>

                    <button
                      type="button"
                      onClick={async () => {

                        try {
                          const token =
                            localStorage.getItem(
                              "access_token"
                            );

                          const response =
                            await fetch(
                              `http://127.0.0.1:8000/accounts/${account.id}`,
                              {
                                method: "PUT",

                                headers: {
                                  "Content-Type":
                                    "application/json",

                                  Authorization:
                                    `Bearer ${token}`,
                                },

                                body:
                                  JSON.stringify({
                                    name:
                                      document.getElementById(
                                        `name-${account.id}`
                                      ).value,

                                    type:
                                      document.getElementById(
                                        `type-${account.id}`
                                      ).value,

                                    balance:
                                      Number(
                                        document.getElementById(
                                          `balance-${account.id}`
                                        ).value
                                      ),

                                    currency:
                                      document.getElementById(
                                        `currency-${account.id}`
                                      ).value,
                                  }),
                              }
                            );

                          if (!response.ok) {
                            const data =
                              await response.json();

                            alert(
                              data.detail ||
                                "Failed to update account"
                            );

                            return;
                          }

                          setEditingAccount(
                            null
                          );

                          window.location.reload();

                        } catch {
                          alert(
                            "Unable to connect to server"
                          );
                        }
                      }}
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setEditingAccount(null)
                      }
                    >
                      Cancel
                    </button>

                  </div>

                ) : (

                  /* NORMAL ACCOUNT */

                  <>
                    <div>

                      <h3>
                        {account.name}
                      </h3>

                      <p>
                        {account.type}
                      </p>

                      <small>
                        {account.currency}
                      </small>

                    </div>

                    <div>

                      <strong>
                        ₹{account.balance}
                      </strong>

                      <br />

                      <button
                        type="button"
                        className="edit-account-button"
                        onClick={() =>
                          setEditingAccount(
                            account.id
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-account-button"
                        onClick={
                          handleDeleteAccount
                        }
                      >
                        Delete
                      </button>

                    </div>
                  </>

                )}

              </div>
            );
          })}

        </div>

      </section>


      {/* =========================
          SUMMARY CARDS
          ========================= */}

      <section className="summary-grid">

        <div className="summary-card">

          <p>Total Balance</p>

          <h2>
            ₹{dashboard.total_balance}
          </h2>

        </div>

        <div className="summary-card">

          <p>Total Income</p>

          <h2>
            ₹{dashboard.total_income}
          </h2>

        </div>

        <div className="summary-card">

          <p>Total Expense</p>

          <h2>
            ₹{dashboard.total_expense}
          </h2>

        </div>

      </section>


      {/* =========================
          FINANCIAL INSIGHTS
          ========================= */}

      <section className="dashboard-card insights-card">

        <h2>
          Financial Insights
        </h2>

        <div className="insights-grid">

          {/* TOP CATEGORY */}

          <div className="insight-item">

            <span className="insight-icon">
              💡
            </span>

            <div>

              <p>
                Top Spending Category
              </p>

              <strong>
                {topCategoryName}
              </strong>

              <small>
                ₹{topCategoryAmount.toFixed(2)}
              </small>

            </div>

          </div>


          {/* TOTAL SPENDING */}

          <div className="insight-item">

            <span className="insight-icon">
              📊
            </span>

            <div>

              <p>
                Total Spending
              </p>

              <strong>
                ₹{totalExpense.toFixed(2)}
              </strong>

              <small>
                Current expenses
              </small>

            </div>

          </div>


          {/* SAVINGS RATE */}

          <div className="insight-item">

            <span className="insight-icon">
              💰
            </span>

            <div>

              <p>
                Savings Rate
              </p>

              <strong>
                {savingsRate.toFixed(1)}%
              </strong>

              <small>
                After expenses
              </small>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          MAIN DASHBOARD GRID
          ========================= */}

      <section className="dashboard-grid">


        {/* =========================
            SPENDING CHART
            ========================= */}

        <div className="dashboard-card spending-chart-card">

          <h2>
            Spending by Category
          </h2>

          {spendingData.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <PieChart>

                <Pie
                  data={spendingData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={55}
                  paddingAngle={3}
                  label
                >

                  {spendingData.map(
                    (entry, index) => (

                      <Cell
                        key={`cell-${index}`}
                        fill={
                          [
                            "#4f46e5",
                            "#16a34a",
                            "#f59e0b",
                            "#ef4444",
                            "#8b5cf6",
                            "#06b6d4",
                          ][index % 6]
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          ) : (

            <p>
              No spending data yet.
            </p>

          )}

        </div>


        {/* =========================
            INCOME VS EXPENSE
            ========================= */}

        <div className="dashboard-card income-expense-card">

          <h2>
            Income vs Expense
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={incomeExpenseData}
              margin={{
                top: 20,
                right: 20,
                left: 10,
                bottom: 20,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="amount"
                name="Amount"
                radius={[
                  8,
                  8,
                  0,
                  0,
                ]}
                barSize={70}
              >

                {incomeExpenseData.map(
                  (entry, index) => (

                    <Cell
                      key={`bar-${index}`}
                      fill={
                        index === 0
                          ? "#16a34a"
                          : "#ef4444"
                      }
                    />

                  )
                )}

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        </div>


        {/* =========================
            BUDGETS
            ========================= */}

        <div className="dashboard-card">

          <h2>
            Budgets
          </h2>

          {dashboard.budgets.map(
            (budget) => {

              const percentage =
                Math.min(
                  (Number(
                    budget.spent
                  ) /
                    Number(
                      budget.budget
                    )) *
                    100,
                  100
                );

              const handleDeleteBudget =
                async () => {

                  const confirmed =
                    window.confirm(
                      `Delete ${budget.category} budget?`
                    );

                  if (!confirmed) {
                    return;
                  }

                  try {

                    const token =
                      localStorage.getItem(
                        "access_token"
                      );

                    const response =
                      await fetch(
                        `http://127.0.0.1:8000/budgets/${budget.id}`,
                        {
                          method: "DELETE",

                          headers: {
                            Authorization:
                              `Bearer ${token}`,
                          },
                        }
                      );

                    if (!response.ok) {

                      const data =
                        await response.json();

                      alert(
                        data.detail ||
                          "Failed to delete budget"
                      );

                      return;
                    }

                    window.location.reload();

                  } catch {

                    alert(
                      "Unable to connect to server"
                    );

                  }
                };

              return (

                <div
                  className="budget-item"
                  key={budget.id}
                >

                  <div className="budget-header">

                    <span>
                      {budget.category}
                    </span>

                    <span>
                      ₹{budget.spent} / ₹
                      {budget.budget}
                    </span>

                  </div>

                  <div className="progress-bar">

                    <div
                      className="progress"
                      style={{
                        width:
                          `${percentage}%`,
                      }}
                    />

                  </div>

                  <div className="budget-footer">

                    <p>
                      Remaining: ₹
                      {budget.remaining}
                    </p>

                    <button
                      type="button"
                      className="delete-budget-button"
                      onClick={
                        handleDeleteBudget
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              );
            }
          )}

        </div>

      </section>


      {/* =========================
          RECENT TRANSACTIONS
          ========================= */}

      <section className="dashboard-card transactions-card">

        <h2>
          Recent Transactions
        </h2>

        {dashboard.recent_transactions.map(
          (transaction) => {

            const handleDeleteTransaction =
              async () => {

                const confirmed =
                  window.confirm(
                    `Delete "${transaction.description}" transaction?`
                  );

                if (!confirmed) {
                  return;
                }

                try {

                  const token =
                    localStorage.getItem(
                      "access_token"
                    );

                  const response =
                    await fetch(
                      `http://127.0.0.1:8000/transactions/${transaction.id}`,
                      {
                        method: "DELETE",

                        headers: {
                          Authorization:
                            `Bearer ${token}`,
                        },
                      }
                    );

                  if (!response.ok) {

                    const data =
                      await response.json();

                    alert(
                      data.detail ||
                        "Failed to delete transaction"
                    );

                    return;
                  }

                  window.location.reload();

                } catch {

                  alert(
                    "Unable to connect to server"
                  );

                }
              };


            const handleEditTransaction =
              async () => {

                try {

                  const token =
                    localStorage.getItem(
                      "access_token"
                    );

                  const description =
                    document.getElementById(
                      `transaction-description-${transaction.id}`
                    ).value;

                  const amount =
                    Number(
                      document.getElementById(
                        `transaction-amount-${transaction.id}`
                      ).value
                    );

                  const type =
                    document.getElementById(
                      `transaction-type-${transaction.id}`
                    ).value;

                  const category =
                    document.getElementById(
                      `transaction-category-${transaction.id}`
                    ).value;

                  const response =
                    await fetch(
                      `http://127.0.0.1:8000/transactions/${transaction.id}`,
                      {
                        method: "PUT",

                        headers: {
                          "Content-Type":
                            "application/json",

                          Authorization:
                            `Bearer ${token}`,
                        },

                        body:
                          JSON.stringify({
                            account_id:
                              transaction.account_id,

                            amount: amount,

                            type: type,

                            category:
                              category,

                            description:
                              description,
                          }),
                      }
                    );

                  if (!response.ok) {

                    const data =
                      await response.json();

                    alert(
                      data.detail ||
                        "Failed to update transaction"
                    );

                    return;
                  }

                  setEditingTransaction(
                    null
                  );

                  window.location.reload();

                } catch {

                  alert(
                    "Unable to connect to server"
                  );

                }
              };


            return (

              <div
                className="transaction-row"
                key={transaction.id}
              >

                {editingTransaction ===
                transaction.id ? (

                  /* EDIT TRANSACTION */

                  <div className="transaction-edit-form">

                    <input
                      type="text"
                      defaultValue={
                        transaction.description
                      }
                      id={`transaction-description-${transaction.id}`}
                    />

                    <input
                      type="number"
                      step="0.01"
                      defaultValue={
                        transaction.amount
                      }
                      id={`transaction-amount-${transaction.id}`}
                    />

                    <select
                      defaultValue={
                        transaction.type
                      }
                      id={`transaction-type-${transaction.id}`}
                    >

                      <option value="expense">
                        Expense
                      </option>

                      <option value="income">
                        Income
                      </option>

                    </select>

                    <select
                      defaultValue={
                        transaction.category
                      }
                      id={`transaction-category-${transaction.id}`}
                    >

                      <option value="Food">
                        Food
                      </option>

                      <option value="Travel">
                        Travel
                      </option>

                      <option value="Bills">
                        Bills
                      </option>

                      <option value="Shopping">
                        Shopping
                      </option>

                      <option value="Entertainment">
                        Entertainment
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                    <button
                      type="button"
                      onClick={
                        handleEditTransaction
                      }
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setEditingTransaction(
                          null
                        )
                      }
                    >
                      Cancel
                    </button>

                  </div>

                ) : (

                  /* NORMAL TRANSACTION */

                  <>

                    <div>

                      <strong>
                        {transaction.description}
                      </strong>

                      <span>
                        {transaction.category}
                      </span>

                    </div>

                    <div>

                      <strong
                        className={
                          transaction.type ===
                          "expense"
                            ? "expense"
                            : "income"
                        }
                      >

                        {transaction.type ===
                        "expense"
                          ? "-"
                          : "+"}

                        ₹{transaction.amount}

                      </strong>

                      <button
                        type="button"
                        className="edit-transaction-button"
                        onClick={() =>
                          setEditingTransaction(
                            transaction.id
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-transaction-button"
                        onClick={
                          handleDeleteTransaction
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </>

                )}

              </div>

            );
          }
        )}

      </section>

    </div>
  );
}

export default Dashboard;