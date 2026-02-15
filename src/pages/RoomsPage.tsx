import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getRooms, deleteRoom, createRoom, updateRoom } from "../api/rooms";
import toast from "react-hot-toast";
import { formatToWIB } from "../utils/date";
import { getCurrentUser } from "../utils/auth";

export default function RoomsPage() {
  const user = getCurrentUser();
  const isAdmin = user?.role === "Admin";

  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 7;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getRooms()
      .then(setRooms)
      .finally(() => setLoading(false));
  }, []);

  const filteredRooms = rooms.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.id.toString().includes(q) ||
      r.name.toLowerCase().includes(q) ||
      r.building.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, rooms.length]);

  // delete
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState<number | null>(null);

  async function handleDelete() {
    if (!deleteRoomId) return;

    try {
      await deleteRoom(deleteRoomId);
      const data = await getRooms();
      setRooms(data);
      toast.success("Room deleted successfully! :)");
      setOpenDelete(false);
      setDeleteRoomId(null);
    } catch {
      toast.error("Failed to delete room :(");
    }
  }

  // create
  const [openCreate, setOpenCreate] = useState(false);

  const [form, setForm] = useState({
    name: "",
    building: "",
    capacity: 0,
  });

  async function handleCreateRoom() {
    if (!form.name || !form.building || !form.capacity) {
      toast.error("All field must be filled!");
      return;
    }

    try {
      await createRoom({
        name: form.name,
        building: form.building,
        capacity: Number(form.capacity),
      });

      const data = await getRooms();
      setRooms(data);

      toast.success("Room added successfully! :)");
      setOpenCreate(false);
      setForm({ name: "", building: "", capacity: 0 });
    } catch {
      toast.error("Failed to add room :(");
    }
  }

  {
    openCreate && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Add Room</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Room Code</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                placeholder="C-102"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Building</label>
              <input
                type="text"
                value={form.building}
                onChange={(e) => setForm({ ...form, building: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                placeholder="D4"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Capacity</label>
              <input
                type="number"
                value={form.capacity}
                onChange={(e) =>
                  setForm({ ...form, capacity: Number(e.target.value) })
                }
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                placeholder="30"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setOpenCreate(false)}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              onClick={handleCreateRoom}
              className="px-4 py-2 rounded bg-[#FEF3C7] hover:bg-[#fde68a] font-semibold"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  // edit
  const [openEdit, setOpenEdit] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any | null>(null);

  const [editForm, setEditForm] = useState({
    name: "",
    building: "",
    capacity: 0,
  });

  async function handleUpdateRoom() {
    if (!editingRoom) return;

    if (!editForm.name || !editForm.building || !editForm.capacity) {
      toast.error("All field must be filled!");
      return;
    }

    try {
      await updateRoom(editingRoom.id, {
        name: editForm.name,
        building: editForm.building,
        capacity: Number(editForm.capacity),
      });

      const data = await getRooms();
      setRooms(data);

      toast.success("Room edited successfully! :)");
      setOpenEdit(false);
      setEditingRoom(null);
    } catch {
      toast.error("Failed to edit room :(");
    }
  }

  // view
  const [openView, setOpenView] = useState(false);
  const [viewRoom, setViewRoom] = useState<any | null>(null);

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
          placeholder="Search by ID, room name, or building"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FEF3C7] focus:border-[#FEF3C7] transition-all shadow-sm"
        />
      </div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-3xl font-extrabold">Rooms</p>

        {isAdmin && (
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
                  fill-rule="evenodd"
                  d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                />
              </svg>{" "}
              <p className="text-sm">Add Room</p>
            </button>
          </div>
        )}
      </div>

      {/* TABLE */}
      {loading ? (
        <p className="py-10 text-center text-gray-400">Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-[#FFFFFF] rounded-xl p-4">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead className="text-center">
              <tr className="text-gray-400 text-sm uppercase tracking-wider">
                <th className="px-4 py-2 font-bold">Room Code</th>
                <th className="px-4 py-2 font-bold">Building</th>
                <th className="px-4 py-2 font-bold">Capacity</th>
                {isAdmin && <th className="px-4 py-2 font-bold">Action</th>}
              </tr>
            </thead>
            <tbody className="text-black font-bold text-center">
              {paginatedRooms.length === 0 && !loading && (
                <tr>
                  <td colSpan={10} className="py-6 text-center text-gray-400">
                    Data not found
                  </td>
                </tr>
              )}

              {paginatedRooms.map((r) => (
                <tr key={r.id} className="text-sm">
                  <td className="px-4 py-1">{r.name}</td>
                  <td className="px-4 py-1">{r.building}</td>
                  <td className="px-4 py-1">{r.capacity}</td>
                  {isAdmin && (
                    <td className="px-4 py-1 text-center">
                      <div className="flex justify-center gap-3">
                        {/* BUTTON VIEW */}
                        <button
                          onClick={() => {
                            setViewRoom(r);
                            setOpenView(true);
                          }}
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

                        {/* BUTTON EDIT */}
                        <button
                          onClick={() => {
                            setEditingRoom(r);
                            setEditForm({
                              name: r.name,
                              building: r.building,
                              capacity: r.capacity,
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

                        {/* BUTTON DELETE */}
                        <button
                          onClick={() => {
                            setDeleteRoomId(r.id);
                            setOpenDelete(true);
                          }}
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
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex items-center justify-between pt-4 rounded-b-xl border-t border-gray-100">
            {/* Tombol Previous */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

      {/* MODAL CREATE */}
      {isAdmin && openCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Add Room</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Room Code</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  placeholder="Enter room code"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Building</label>
                <input
                  type="text"
                  value={form.building}
                  onChange={(e) =>
                    setForm({ ...form, building: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  placeholder="Enter building"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Capacity</label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) =>
                    setForm({ ...form, capacity: Number(e.target.value) })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  placeholder="Enter room capacity"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setOpenCreate(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateRoom}
                className="px-4 py-2 rounded bg-[#FEF3C7]! hover:bg-[#fde68a]! font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {isAdmin && openEdit && editingRoom && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Edit Room</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Room Code</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Building</label>
                <input
                  type="text"
                  value={editForm.building}
                  onChange={(e) =>
                    setEditForm({ ...editForm, building: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Capacity</label>
                <input
                  type="number"
                  value={editForm.capacity}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      capacity: Number(e.target.value),
                    })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setOpenEdit(false);
                  setEditingRoom(null);
                }}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateRoom}
                className="px-4 py-2 rounded bg-[#FEF3C7]! hover:bg-[#fde68a]! font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VIEW */}
      {isAdmin && openView && viewRoom && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Room Detail</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Room ID</span>
                <span className="font-semibold">{viewRoom.id}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Room Code</span>
                <span className="font-semibold">{viewRoom.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Building</span>
                <span className="font-semibold">{viewRoom.building}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Capacity</span>
                <span className="font-semibold">{viewRoom.capacity}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Created At</span>
                <span className="font-semibold">
                  {formatToWIB(viewRoom.createdAt)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Updated At</span>
                <span className="font-semibold">
                  {formatToWIB(viewRoom.updatedAt)}
                </span>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setOpenView(false);
                  setViewRoom(null);
                }}
                className="px-4 py-2 rounded bg-[#FEF3C7] hover:bg-[#fde68a] font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {openDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-2 text-red-600 text-center">
              Delete Room
            </h2>

            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete this room? You won't be able to
              undo this action.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setOpenDelete(false);
                  setDeleteRoomId(null);
                }}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-500! text-white! hover:bg-red-600!"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
