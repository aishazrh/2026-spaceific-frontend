import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import AllBookings from "./pages/AllBookingsPage";
import Rooms from "./pages/RoomsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rooms"
        element={
          <ProtectedRoute>
            <Rooms />
          </ProtectedRoute>
        }
      />

      <Route
        path="/all-bookings"
        element={
          <ProtectedRoute>
            <AllBookings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
