import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getBookings } from "../api/bookings";

export default function HistoryPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookings()
      .then(setBookings)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <h1>History</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Room</th>
              <th>Purpose</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.room}</td>
                <td>{b.purpose}</td>
                <td>{new Date(b.start).toLocaleString()}</td>
                <td>{new Date(b.end).toLocaleString()}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
