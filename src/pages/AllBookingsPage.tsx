import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getBookings } from "../api/bookings";
import { formatToWIB } from "../utils/date";
import { updateBookingStatus } from "../api/bookings";
import toast from "react-hot-toast";
import "../styles/index.css";
import { getCurrentUser } from "../utils/auth";

export default function HistoryPage() {
  const user = getCurrentUser();
  const isAdmin = user?.role === "Admin";

  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<Record<number, string>>(
    {},
  );
  const [confirmModal, setConfirmModal] = useState<{
    id: number;
    status: string;
  } | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [dropdownDirection, setDropdownDirection] = useState<"up" | "down">(
    "down",
  );

  const toggleDropdown = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number,
  ) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;

      if (spaceBelow < 250) {
        setDropdownDirection("up");
      } else {
        setDropdownDirection("down");
      }
      setOpenDropdown(id);
    }
  };

  const ITEMS_PER_PAGE = 5;

  const [currentPage, setCurrentPage] = useState(1);

  async function getMyBookings() {
    return fetch("/api/bookings/my").then((res) => res.json());
  }

  useEffect(() => {
    const fetch = isAdmin ? getBookings : getMyBookings;
    fetch()
      .then(setBookings)
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const filteredBookings = bookings.filter((b) => {
    const q = search.toLowerCase();

    return (
      b.id.toString().includes(q) ||
      b.firstName.toLowerCase().includes(q) ||
      b.lastName.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [bookings.length]);

  async function handleUpdateStatus(id: number, status: string) {
    if (!status) return;

    try {
      await updateBookingStatus(id, status);
      const data = await getBookings();
      setBookings(data);

      toast.success("Status updated! :)");
      return true;
    } catch (err) {
      toast.error("Update failed :(");
      return false;
    }
  }

  return (
    <Layout>
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
          placeholder="Search by ID, first name, or last name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FEF3C7] focus:border-[#FEF3C7] transition-all shadow-sm"
        />
      </div>

      {/* JUDUL */}
      <p className="text-3xl font-extrabold mb-6">
        {isAdmin ? "All Bookings" : "History"}
      </p>

      {/* TABEL */}
      {loading ? (
        <p className="text-center py-4">Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-[#FFFFFF] rounded-xl p-4">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead className="text-center">
              <tr className="text-gray-400 text-sm uppercase tracking-wider">
                <th className="px-4 py-2 font-bold">ID</th>
                <th className="px-4 py-2 font-bold">First Name</th>
                <th className="px-4 py-2 font-bold">Last Name</th>
                <th className="px-4 py-2 font-bold">Room</th>
                <th className="px-4 py-2 font-bold">Purpose</th>
                <th className="px-4 py-2 font-bold">Start</th>
                <th className="px-4 py-2 font-bold">End</th>
                <th className="px-4 py-2 font-bold">Status</th>
                <th className="px-4 py-2 font-bold">Action</th>
                <th className="px-4 py-2 font-bold"></th>
              </tr>
            </thead>
            <tbody className="text-black font-bold text-center">
              {paginatedBookings.length === 0 && !loading && (
                <tr>
                  <td colSpan={10} className="py-6 text-center text-gray-400">
                    Data not found
                  </td>
                </tr>
              )}

              {paginatedBookings.map((b) => (
                <tr key={b.id} className="text-sm">
                  <td className="px-4 py-1">{b.id}</td>
                  <td className="px-4 py-1">{b.firstName}</td>
                  <td className="px-4 py-1">{b.lastName}</td>
                  <td className="px-4 py-1">{b.room}</td>
                  <td className="px-4 py-1">{b.purpose}</td>
                  <td className="px-4 py-1">{formatToWIB(b.start)}</td>
                  <td className="px-4 py-1">{formatToWIB(b.end)}</td>
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
                  <td className="px-4 py-1 relative">
                    {isAdmin ? (
                      <div className="relative inline-block text-center">
                        <button
                          type="button"
                          onClick={(e) => toggleDropdown(e, b.id)} // Pakai fungsi deteksi
                          className="border px-3 py-1 rounded bg-white hover:bg-gray-50"
                        >
                          Change status
                        </button>

                        {openDropdown === b.id && (
                          <div
                            className={`
                            absolute z-20 w-40 bg-white rounded-lg shadow-lg border p-2 left-1/2 -translate-x-1/2
                            ${dropdownDirection === "up" ? "bottom-full mb-2" : "top-full mt-2"}
                          `}
                          >
                            <button
                              onClick={() =>
                                setSelectedStatus((prev) => ({
                                  ...prev,
                                  [b.id]: "Approved",
                                }))
                              }
                              className="block w-full text-center px-3 py-1 rounded hover:bg-green-100"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                setSelectedStatus((prev) => ({
                                  ...prev,
                                  [b.id]: "Rejected",
                                }))
                              }
                              className="block w-full text-center px-3 py-1 rounded hover:bg-red-100"
                            >
                              Reject
                            </button>

                            <button
                              onClick={() =>
                                setSelectedStatus((prev) => ({
                                  ...prev,
                                  [b.id]: "Pending",
                                }))
                              }
                              className="block w-full text-center px-3 py-1 rounded hover:bg-blue-100"
                            >
                              Pending
                            </button>

                            <hr className="my-2" />

                            <button
                              disabled={!selectedStatus[b.id]}
                              onClick={() =>
                                setConfirmModal({
                                  id: b.id,
                                  status: selectedStatus[b.id],
                                })
                              }
                              className={`w-full px-3 py-1 rounded text-sm ${
                                selectedStatus[b.id]
                                  ? "text-black"
                                  : "text-black cursor-not-allowed"
                              }`}
                            >
                              Submit
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex justify-center gap-3">
                        <button>👁️</button>
                        <button>✏️</button>
                        <button>🗑️</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex items-center justify-between pt-4 rounded-b-xl border-t border-gray-100">
            {/* Tombol Previous */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 font-semibold transition-all ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-black hover:text-black"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Previous</span>
            </button>

            {/* Nomor Halaman */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold transition-all ${
                      currentPage === page
                        ? "bg-[#FEF3C7]! text-black shadow-sm"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* Tombol Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 font-semibold transition-all ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-black hover:text-black"
              }`}
            >
              <span>Next</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {confirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
            <p className="text-lg font-bold mb-2">Confirm Action</p>
            <p className="text-sm text-gray-600 mb-4">
              Yakin mau ubah status booking #{confirmModal.id} jadi{" "}
              <span className="font-semibold">{confirmModal.status}</span>?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  const success = await handleUpdateStatus(
                    confirmModal.id,
                    confirmModal.status,
                  );

                  if (!success) return;

                  setSelectedStatus((prev) => {
                    const copy = { ...prev };
                    delete copy[confirmModal.id];
                    return copy;
                  });

                  setOpenDropdown(null);
                  setConfirmModal(null);
                }}
                className="px-4 py-2 rounded text-black hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
