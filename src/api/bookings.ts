import { API_BASE_URL } from "../config/api";

export async function getBookings() {
  const res = await fetch(`${API_BASE_URL}/bookings`);
  if (!res.ok) throw new Error("Gagal fetch bookings");
  return res.json();
}
