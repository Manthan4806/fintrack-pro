import { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("access_token")
  );

  if (!token) {
    return (
      <Login
        onLogin={(newToken) => {
          setToken(newToken);
        }}
      />
    );
  }

  return (
    <Dashboard
      onLogout={() => {
        localStorage.removeItem("access_token");
        setToken(null);
      }}
    />
  );
}

export default App;