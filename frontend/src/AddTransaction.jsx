import { useState } from "react";

function AddTransaction({ accounts, onTransactionAdded }) {
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        "http://127.0.0.1:8000/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            account_id: accountId,
            amount: Number(amount),
            type: type,
            category: category,
            description: description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail || "Failed to add transaction"
        );
        return;
      }

      setSuccess(
        "Transaction added successfully!"
      );

      setAmount("");
      setDescription("");

      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch {
      setError("Unable to connect to server");
    }
  };

  return (
    <div className="dashboard-card add-transaction-card">
      <h2> ADD TRANSACTION</h2>

      <form onSubmit={handleSubmit}>

        <label>Account</label>

        <select
          value={accountId}
          onChange={(e) =>
            setAccountId(e.target.value)
          }
          required
        >
          <option value="">
            Select account
          </option>

          {accounts.map((account) => (
            <option
              key={account.id}
              value={account.id}
            >
              {account.name}
            </option>
          ))}
        </select>

        <label>Amount</label>

        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          placeholder="Enter amount"
          required
        />

        <label>Type</label>

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
        >
          <option value="expense">
            Expense
          </option>

          <option value="income">
            Income
          </option>
        </select>

        <label>Category</label>

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">
            Entertainment
          </option>
          <option value="Other">Other</option>
        </select>

        <label>Description</label>

        <input
          type="text"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          placeholder="e.g. Dinner"
          required
        />

        {error && (
          <p className="error">{error}</p>
        )}

        {success && (
          <p className="success">{success}</p>
        )}

        <button type="submit">
          Add Transaction
        </button>

      </form>
    </div>
  );
}

export default AddTransaction;