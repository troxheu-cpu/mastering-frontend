const API = import.meta.env.VITE_API_BASE_URL;

export async function ping() {
  const res = await fetch(`${API}/`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
