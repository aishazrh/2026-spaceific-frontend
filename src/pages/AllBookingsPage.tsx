import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { formatToWIB } from "../utils/date";
import toast from "react-hot-toast";
import "../styles/index.css";
import { getCurrentUser } from "../utils/auth";
import {
  updateBookingStatus,
  createBooking,
  // updateMyBooking,
  deleteMyBooking,
  getBookings,
  getMyBookings,
} from "../api/bookings";
import { getRooms } from "../api/rooms";

export default function HistoryPage() {
  const user = getCurrentUser();
  const isAdmin = user?.role === "Admin";
  if (!user) {
    throw new Error("User not logged in");
  }

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

  // create booking
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState({
    roomId: 0,
    purpose: "",
    start: "",
    end: "",
  });

  // rooms
  const [rooms, setRooms] = useState<any[]>([]);
  useEffect(() => {
    if (!isAdmin) {
      getRooms().then(setRooms);
    }
  }, [isAdmin]);

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

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-3xl font-extrabold">
          {isAdmin ? "All Bookings" : "History"}
        </p>

        {!isAdmin && (
          <div className="flex gap-2 text-center">
            <button
              onClick={() => setOpenCreate(true)}
              className="flex items-center gap-2 rounded-lg bg-[#FEF3C7]! hover:bg-[#fde68a] font-semibold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-plus-lg"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                />
              </svg>{" "}
              <p className="text-sm">Add Booking</p>
            </button>
          </div>
        )}
      </div>

      {/* TABEL */}
      {loading ? (
        <p className="py-10 text-center text-gray-400">Loading...</p>
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
                  <td className="px-4 py-1">{b.roomName}</td>
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
                        <button
                          onClick={() => {
                            setForm({
                              roomId: b.roomId,
                              purpose: b.purpose,
                              start: b.start.slice(0, 16),
                              end: b.end.slice(0, 16),
                            });
                            setOpenCreate(true);
                          }}
                        >
                          ✏️
                        </button>

                        <button
                          onClick={async () => {
                            if (!confirm("Yakin mau hapus booking ini?"))
                              return;

                            try {
                              await deleteMyBooking(b.id);
                              const data = await getMyBookings();
                              setBookings(data);
                              toast.success("Booking deleted");
                            } catch {
                              toast.error("Delete failed");
                            }
                          }}
                        >
                          🗑️
                        </button>
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

      {/* MODAL UPDATE STATUS (ADMIN) */}
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

      {/* MODAL CREATE BOOKING (USER) */}
      {openCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">
              Create Booking
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Building</label>

                <select
                  value={form.roomId || ""}
                  onChange={(e) =>
                    setForm({ ...form, roomId: Number(e.target.value) })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                >
                  <option value="">Choose room</option>

                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} | Building: {r.building}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold">Purpose</label>
                <input
                  type="text"
                  placeholder="Enter purpose"
                  value={form.purpose}
                  onChange={(e) =>
                    setForm({ ...form, purpose: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Start</label>
                <input
                  type="datetime-local"
                  value={form.start}
                  onChange={(e) => setForm({ ...form, start: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">End</label>
                <input
                  type="datetime-local"
                  value={form.end}
                  onChange={(e) => setForm({ ...form, end: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setOpenCreate(false)}
                className="px-4 py-2 rounded bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    if (!form.roomId) {
                      toast.error("Please choose a room!");
                      return;
                    }

                    await createBooking({
                      roomId: form.roomId,
                      purpose: form.purpose,
                      start: form.start,
                      end: form.end,
                      allDay: false,
                    });

                    const data = await getMyBookings();
                    setBookings(data);

                    toast.success("Booking created!");
                    setOpenCreate(false);
                    setForm({ roomId: 0, purpose: "", start: "", end: "" });
                  } catch {
                    toast.error("Failed to create booking");
                  }
                }}
                className="px-4 py-2 rounded bg-[#FEF3C7]! hover:bg-[#fde68a]! font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
