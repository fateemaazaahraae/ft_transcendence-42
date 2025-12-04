const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function getHistory(userA: string, userB: string) {
  const res = await fetch(`${BASE}/messages/history/${userA}/${userB}`);
  if (!res.ok) throw new Error("failed");
  return res.json();
}

export async function blockUser(blockerId: string, blockedId: string, token: string) {
  const res = await fetch(`${BASE}/block`, {
    method: "POST",
    headers: { "Content-Type":"application/json", "Authorization": `Bearer ${token}`},
    body: JSON.stringify({ blockerId, blockedId })
  });
  return res.json();
}
