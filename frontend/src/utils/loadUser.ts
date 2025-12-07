import {navigate} from "../main.ts"

export async function loadUser() {
  try {
    const res = await fetch("http://localhost:3000/user/me", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user));
    } else {
      navigate("/login");
    }
  } catch {
    navigate("/login");
  }
}
