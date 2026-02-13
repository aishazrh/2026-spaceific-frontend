import { Navigate } from "react-router-dom";
import React from "react";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: "Admin" | "User";
}) {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  if (!token || !userRaw) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userRaw);

  if (role && user.role !== role) {
    return <Navigate to="/user" replace />;
  }

  return <>{children}</>;
}
