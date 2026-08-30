import { useState } from "react";

function AddAccount({ onAccountAdded }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Savings");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        "http://127.0.0.1:8000/accounts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name,
            type: type,
            balance: Number(balance),
            currency: currency,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail || "Failed to add account"
        );
        return;
      }

      setSuccess("Account added successfully!");

      setName("");
      setBalance("");

      if (onAccountAdded) {
        onAccountAdded();
      }
    } catch {
      setError("Unable to connect to server");
    }
  };

  return (
    <div className="dashboard-card">
      <h2>Add Account</h2>

      <form onSubmit={handleSubmit}>

        <label>Account Name</label>

        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="e.g. ICICI Savings"
          required
        />

        <label>Account Type</label>

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
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

        <label>Initial Balance</label>

        <input
          type="number"
          step="0.01"
          value={balance}
          onChange={(e) =>
            setBalance(e.target.value)
          }
          placeholder="Enter balance"
          required
        />

        <label>Currency</label>

        <select
          value={currency}
          onChange={(e) =>
            setCurrency(e.target.value)
          }
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>

        {error && (
          <p className="error">{error}</p>
        )}

        {success && (
          <p className="success">{success}</p>
        )}

        <button type="submit">
          Add Account
        </button>

      </form>
    </div>
  );
}

export default AddAccount;