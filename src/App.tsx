import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import AllBookings from "./pages/AllBookingsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/all-bookings" element={<AllBookings />} />
    </Routes>
  );
}

export default App;
