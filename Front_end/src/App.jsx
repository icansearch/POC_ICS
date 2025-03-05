import { useState } from "react";

function App() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const checkPrice = async () => {
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`http://localhost:3000/api/price/${domain}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Something went wrong");

      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial, sans-serif" }}>
      <h1>Domain Price Checker</h1>
      <input
        type="text"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="Enter domain (e.g., example.com)"
        style={{ padding: "8px", marginRight: "10px", width: "250px" }}
      />
      <button onClick={checkPrice} style={{ padding: "8px 12px", backgroundColor: "black", color: "white", border: "none", cursor: "pointer" }}>
        Check Availability
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "20px", padding: "20px", border: "1px solid #ccc", display: "inline-block", textAlign: "left" }}>
          <h2 style={{ color: "green" }}>✔ {result.domain} is available!</h2>
          <p>Purchase from one of the following registrars:</p>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ marginRight: "10px" }}>GoDaddy</span>
              {result.price !== null ? <span><strong>${result.price}</strong></span> : <span>N/A</span>}
              <button style={{ marginLeft: "auto", padding: "5px 10px", backgroundColor: "blue", color: "white", border: "none", cursor: "pointer" }}>
                Buy Now
              </button>
            </li>
            <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ marginRight: "10px" }}>Dynadot</span>
              {result.dynadotPrice !== null ? <span><strong>${result.dynadotPrice}</strong></span> : <span>N/A</span>}
              <button style={{ marginLeft: "auto", padding: "5px 10px", backgroundColor: "blue", color: "white", border: "none", cursor: "pointer" }}>
                Buy Now
              </button>
            </li>
            {["Hostinger", "Namecheap", "BigRock"].map((registrar) => (
              <li key={registrar} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ marginRight: "10px" }}>{registrar}</span>
                <button style={{ marginLeft: "auto", padding: "5px 10px", backgroundColor: "blue", color: "white", border: "none", cursor: "pointer" }}>
                  Buy Now
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
