import { useState } from "react";
import { ping } from "./api";

export default function App() {
  const [status, setStatus] = useState("");

  async function testBackend() {
    try {
      const data = await ping();
      setStatus(JSON.stringify(data, null, 2));
    } catch (err) {
      setStatus(`Feil: ${err.message}`);
    }
  }

  return (
    <div style={{ padding: 24, color: "#e5e7eb", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 36, marginBottom: 8 }}>Mastering Frontend</h1>
      <p>Backend: {import.meta.env.VITE_API_BASE_URL}</p>
      <button onClick={testBackend} style={{ marginTop: 12, padding: "8px 12px" }}>
        Test backend
      </button>
      <pre style={{ marginTop: 16, background: "#111827", padding: 12, borderRadius: 8 }}>
        {status}
      </pre>
    </div>
  );
}
