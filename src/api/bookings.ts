import { API_BASE_URL } from "../config/api";

export async function getBookings() {
  const res = await fetch(`${API_BASE_URL}/bookings`);
  if (!res.ok) throw new Error("Gagal fetch bookings");
  return res.json();
}

export async function updateBookingStatus(id: number, status: string) {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API Error:", text);
    throw new Error("Gagal update status booking");
  }

  if (res.status === 204) return null;
  return res.json();
}
