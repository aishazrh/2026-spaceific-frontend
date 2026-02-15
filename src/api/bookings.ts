import { API_BASE_URL } from "../config/api";

export async function getBookings() {
  const res = await fetch(`${API_BASE_URL}/bookings`);
  if (!res.ok) throw new Error("Gagal fetch bookings");
  return res.json();
}

export async function updateBookingStatus(id: number, status: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export async function updateMyBooking(id: number, data: any) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}/bookings/my/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update booking");

  if (res.status === 204) return null;
  return res.json();
}

export const deleteMyBooking = async (id: number) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}/bookings/my/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Delete failed");
  }
};

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