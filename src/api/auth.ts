import { API_BASE_URL } from "../config/api";

export async function login(data: { username: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Login gagal");
  }

  return res.json();
}

export async function register(data: {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Register gagal");
  }

  return res.json();
}
