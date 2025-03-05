import { useState } from "react";
import "./App.css";

function App() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkDomain = async () => {
    if (!domain) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`http://localhost:3000/api/price/${domain}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error fetching domain price:", error);
      setResult({ error: "Failed to fetch price. Please try again." });
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Domain Price Checker</h1>
      <input
        type="text"
        placeholder="Enter domain (example.com)"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
      />
      <button onClick={checkDomain} disabled={loading}>
        {loading ? "Checking..." : "Check Price"}
      </button>

      {result && (
        <div className="result">
          {result.error ? (
            <p className="error">{result.error}</p>
          ) : (
            <p>
              <strong>Domain:</strong> {result.domain} <br />
              <strong>Price:</strong> {result.price ? `$${result.price}` : "N/A"} <br />
              <strong>Available:</strong> {result.available ? "Yes ✅" : "No ❌"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
