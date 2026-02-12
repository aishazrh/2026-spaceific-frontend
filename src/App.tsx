import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import AllBookings from "./pages/AllBookingsPage";
import Rooms from "./pages/RoomsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/all-bookings" element={<AllBookings />} />
      <Route path="/rooms" element={<Rooms />} />
    </Routes>
  );
}

export default App;
