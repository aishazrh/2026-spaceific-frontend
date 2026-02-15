import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { getBookings, getMyBookings } from "../api/bookings";
import { getCurrentUser } from "../utils/auth";
import "../styles/index.css";

export default function DashboardPage() {
  const user = getCurrentUser();
  const isAdmin = user?.role === "Admin";

  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const totalBookings = allBookings.length;

  const activeBookings = allBookings.filter((b) => {
    const now = new Date();
    const start = new Date(b.start);
    const end = new Date(b.end);
    return now >= start && now <= end && b.status === "Approved";
  }).length;

  const pendingRequests = allBookings.filter(
    (b) => b.status === "Pending",
  ).length;

  useEffect(() => {
    const fetch = isAdmin ? getBookings : getMyBookings;

    fetch()
      .then((data) => {
        const sorted = [...data].sort((a, b) => b.id - a.id);
        setAllBookings(sorted);
        setRecent(sorted.slice(0, 3));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAdmin]);

  return (
    <Layout>
      <div>
        {/* SEARCH BAR */}
        <div className="relative min-w-276 max-w-md mb-6">
          {/* Ikon Search */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Input Field */}
          <input
            type="text"
            placeholder="Search"
            className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FEF3C7] focus:border-[#FEF3C7] transition-all shadow-sm"
          />
        </div>

        {/* JUDUL */}
        <p className="text-3xl font-extrabold mb-6">Dashboard</p>

        {/* 3 THINGY */}
        <div className="flex flex-wrap gap-3 mb-8">
          {/* TOTAL BOOKINGS */}
          <div className="flex-1 min-w-75 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-5 p-6">
              <div className="bg-[#FEF3C7] w-16 h-16 flex items-center justify-center rounded-2xl">
                <p className="text-3xl font-black text-amber-900">
                  {totalBookings}
                </p>
              </div>
              <p className="text-xl font-bold text-gray-800">Total Bookings</p>
            </div>
            <div className="border-t border-gray-100"></div>
            <Link
              to="/all-bookings"
              className="mt-auto flex flex-row gap-3 w-full p-4 rounded-lg font-bold bg-gray-50! text-gray-500! no-underline transition-all duration-200active:scale-95 hover:bg-white! hover:text-black!"
            >
              <div className="basis-9/10">See details</div>
              <svg
                className="w-5 h-5 fill-current basis-1/10"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />{" "}
              </svg>
            </Link>
          </div>

          {/* ACTIVE BOOKINGS */}
          <div className="flex-1 min-w-75 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-5 p-6">
              <div className="bg-[#FEF3C7] w-16 h-16 flex items-center justify-center rounded-2xl">
                <p className="text-3xl font-black text-amber-900">
                  {activeBookings}
                </p>
              </div>
              <p className="text-xl font-bold text-gray-800">Active Bookings</p>
            </div>
            <div className="border-t border-gray-100"></div>
            <Link
              to="/all-bookings"
              className="mt-auto flex flex-row gap-3 w-full p-4 rounded-lg font-bold bg-gray-50! text-gray-500! no-underline transition-all duration-200active:scale-95 hover:bg-white! hover:text-black!"
            >
              <div className="basis-9/10">See details</div>
              <svg
                className="w-5 h-5 fill-current basis-1/10"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />{" "}
              </svg>
            </Link>
          </div>

          {/* PENDING REQUESTS */}
          <div className="flex-1 min-w-75 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-5 p-6">
              <div className="bg-[#FEF3C7] w-16 h-16 flex items-center justify-center rounded-2xl">
                <p className="text-3xl font-black text-amber-900">
                  {pendingRequests}
                </p>
              </div>
              <p className="text-xl font-bold text-gray-800">
                Pending Requests
              </p>
            </div>
            <div className="border-t border-gray-100"></div>
            <Link
              to="/all-bookings"
              className="mt-auto flex flex-row gap-3 w-full p-4 rounded-lg font-bold bg-gray-50! text-gray-500! no-underline transition-all duration-200active:scale-95 hover:bg-white! hover:text-black!"
            >
              <div className="basis-9/10">See details</div>
              <svg
                className="w-5 h-5 fill-current basis-1/10"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />{" "}
              </svg>
            </Link>
          </div>
        </div>

        {/* RECENT BOOKINGS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-black">Recent Bookings</h3>
            <Link
              to="/all-bookings"
              className="text-sm flex items-center gap-1"
              style={{ color: "black" }}
            >
              See all bookings
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : recent.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Belum ada data booking
            </p>
          ) : (
            <div className="overflow-x-auto bg-[#F9FAFB] rounded-xl p-4">
              <table className="w-full text-left border-separate border-spacing-y-3">
                <thead className="text-center">
                  <tr className="text-gray-400 text-sm uppercase tracking-wider">
                    <th className="px-4 py-2 font-bold">ID</th>
                    <th className="px-4 py-2 font-bold">First Name</th>
                    <th className="px-4 py-2 font-bold">Last Name</th>
                    <th className="px-4 py-2 font-bold">Room</th>
                    <th className="px-4 py-2 font-bold">Purpose</th>
                    <th className="px-4 py-2 font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-black font-bold text-center">
                  {recent.map((b) => (
                    <tr key={b.id} className="text-sm">
                      <td className="px-4 py-1">{b.id}</td>
                      <td className="px-4 py-1">{b.firstName}</td>
                      <td className="px-4 py-1">{b.lastName}</td>
                      <td className="px-4 py-1">{b.room}</td>
                      <td className="px-4 py-1">{b.purpose}</td>
                      <td className="px-4 py-1 text-center">
                        <span
                          className={`
                    px-6 py-1.5 rounded-full text-xs font-bold inline-block w-28
                    ${
                      b.status === "Approved"
                        ? "bg-[#4ADE80] text-black"
                        : b.status === "Pending"
                          ? "bg-[#3B82F6] text-white"
                          : "bg-[#F87171] text-white"
                    }
                  `}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
