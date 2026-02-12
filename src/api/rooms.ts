import { API_BASE_URL } from "../config/api";

export async function getRooms() {
  const res = await fetch(`${API_BASE_URL}/rooms`);

  if (!res.ok) throw new Error("Gagal fetch rooms");

  return res.json();
}

export async function createRoom(data: {
  name: string;
  building: string;
  capacity: number;
}) {
  const res = await fetch(`${API_BASE_URL}/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API Error:", text);
    throw new Error("Gagal create room");
  }

  return res.json();
}

export async function updateRoom(
  id: number,
  data: { name: string; building: string; capacity: number },
) {
  const res = await fetch(`${API_BASE_URL}/rooms/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API Error:", text);
    throw new Error("Gagal update room");
  }

  return res.json();
}

export async function deleteRoom(id: number) {
  const res = await fetch(`${API_BASE_URL}/rooms/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API Error:", text);
    throw new Error("Gagal delete room");
  }

  return null;
}
