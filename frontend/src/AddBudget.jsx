import { useState } from "react";

function AddBudget({ onBudgetAdded }) {
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        "http://127.0.0.1:8000/budgets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category: category,
            amount: Number(amount),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail || "Failed to add budget"
        );
        return;
      }

      setSuccess("Budget added successfully!");

      setAmount("");

      if (onBudgetAdded) {
        onBudgetAdded();
      }
    } catch {
      setError("Unable to connect to server");
    }
  };

  return (
    <div className="dashboard-card">
      <h2>Add Budget</h2>

      <form onSubmit={handleSubmit}>

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

        <label>Budget Amount</label>

        <input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          placeholder="Enter budget amount"
          required
        />

        {error && (
          <p className="error">{error}</p>
        )}

        {success && (
          <p className="success">{success}</p>
        )}

        <button type="submit">
          Add Budget
        </button>

      </form>
    </div>
  );
}

export default AddBudget;