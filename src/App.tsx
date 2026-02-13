import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import AllBookings from "./pages/AllBookingsPage";
import Rooms from "./pages/RoomsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/user" element={<Rooms />} />
      <Route path="/admin" element={<DashboardPage />} />
      <Route path="/all-bookings" element={<AllBookings />} />
      <Route path="/rooms" element={<Rooms />} />
    </Routes>
  );
}

export default App;
