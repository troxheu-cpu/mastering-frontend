export const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export async function ping() {
  if (!API_BASE) throw new Error("VITE_API_BASE_URL er ikke satt");
  const res = await fetch(`${API_BASE}/`, { headers: { Accept: "application/json" } });
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const txt = await res.text();
    throw new Error(`Forventet JSON, fikk: ${txt.slice(0, 60)}...`);
  }
  return res.json();
}
