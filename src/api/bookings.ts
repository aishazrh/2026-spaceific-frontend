import { API_BASE_URL } from "../config/api";
import { getCurrentUser } from "../utils/auth";

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

export async function createBooking(payload: {
  roomId: number;
  purpose: string;
  start: string;
  end: string;
  allDay: boolean;
}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Create booking API error:", text);
    throw new Error("Create booking failed");
  }

  return res.json();
}

export async function updateMyBooking(id: number, payload: any) {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Update booking failed");
  return res.json();
}


export async function deleteMyBooking(id: number) {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Delete booking failed");
  return res.json();
}


export async function getMyBookings() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}/bookings/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API Error:", text);
    throw new Error("Gagal fetch my bookings");
  }

  return res.json();
}