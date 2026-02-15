import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { formatToWIB } from "../utils/date";
import toast from "react-hot-toast";
import "../styles/index.css";
import { getCurrentUser } from "../utils/auth";
import {
  updateBookingStatus,
  createBooking,
  updateMyBooking,
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

  const filteredBookings = bookings
    .sort((a, b) => b.id - a.id)
    .filter((b) => {
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

  // edit booking
  const [openEdit, setOpenEdit] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // delete booking
  const [deleteModal, setDeleteModal] = useState<number | null>(null);

  // view booking
  const [viewModal, setViewModal] = useState<any | null>(null);

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
                          onClick={() => setViewModal(b)}
                          className="hover:text-blue-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-eye"
                            viewBox="0 0 16 16"
                          >
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                          </svg>
                        </button>

                        <button
                          onClick={() => {
                            setEditingId(b.id);
                            setForm({
                              roomId: b.roomId,
                              purpose: b.purpose,
                              start: b.start.slice(0, 16),
                              end: b.end.slice(0, 16),
                            });
                            setOpenEdit(true);
                          }}
                          className="hover:text-green-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-pencil"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                          </svg>
                        </button>

                        <button
                          onClick={() => setDeleteModal(b.id)}
                          className="hover:text-red-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-trash3"
                            viewBox="0 0 16 16"
                          >
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                          </svg>
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
                // Di dalam Modal Create Booking
                onClick={async () => {
                  try {
                    if (!form.roomId) {
                      toast.error("Please choose a room!");
                      return;
                    }

                    // 1. Tunggu proses create selesai
                    await createBooking({ ...form, allDay: false });

                    // 2. Ambil data terbaru dari server
                    const data = await getMyBookings();

                    // 3. Update state bookings dengan data baru
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

      {/* MODAL EDIT BOOKING (USER) */}
      {openEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Edit Booking</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Room</label>
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
                onClick={() => {
                  setOpenEdit(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 rounded bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    if (!editingId) return;

                    await updateMyBooking(editingId, {
                      roomId: form.roomId,
                      purpose: form.purpose,
                      start: form.start,
                      end: form.end,
                      allDay: false,
                    });

                    const data = await getMyBookings();
                    setBookings(data);

                    toast.success("Booking updated! :)");
                    setOpenEdit(false);
                    setEditingId(null);
                  } catch {
                    toast.error("Failed to update booking :(");
                  }
                }}
                className="px-4 py-2 rounded bg-[#FEF3C7]! hover:bg-[#fde68a]! font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE BOOKING (USER) */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-3 text-center">
              Delete Booking
            </h2>

            <p className="text-sm text-gray-600 text-center mb-6">
              Are you sure you want to delete this booking? You won't be able to
              undo this action.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 rounded bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    await deleteMyBooking(deleteModal);

                    const data = await getMyBookings();
                    setBookings(data);

                    toast.success("Booking deleted!");
                    setDeleteModal(null);
                  } catch {
                    toast.error("Failed to delete booking");
                  }
                }}
                className="px-4 py-2 rounded bg-red-500! text-white hover:bg-red-600 font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VIEW BOOKING (USER) */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">
              Booking Detail
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Booked by</span>
                <span className="font-semibold">
                  {viewModal.firstName} {viewModal.lastName}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Room</span>
                <span className="font-semibold">{viewModal.roomName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Building</span>
                <span className="font-semibold">{viewModal.building}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Purpose</span>
                <span className="font-semibold">{viewModal.purpose}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Start</span>
                <span className="font-semibold">
                  {formatToWIB(viewModal.start)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">End</span>
                <span className="font-semibold">
                  {formatToWIB(viewModal.end)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-semibold">{viewModal.status}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Created At</span>
                <span className="font-semibold">
                  {formatToWIB(viewModal.createdAt)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Edited At</span>
                <span className="font-semibold">
                  {formatToWIB(viewModal.updatedAt)}
                </span>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewModal(null)}
                className="px-4 py-2 rounded bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
