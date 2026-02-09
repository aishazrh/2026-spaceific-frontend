import { useEffect, useState } from "react";
import { getBookings } from "../api/bookings";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getBookings()
      .then(setBookings)
      .catch(() => setError("Gagal ambil data dari server"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Daftar Booking</h1>
      <pre>{JSON.stringify(bookings, null, 2)}</pre>
    </div>
  );
}
