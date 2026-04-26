import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get("/api/admin/users")
      .then((res) => setUsers(res.data))
      .catch(() => alert("Not authorized"));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await API.delete(`/api/admin/users/${id}`);

      // Update UI after delete
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      alert("Cannot delete admin");
    }
  };

  return (
    <div className="min-h-screen px-8 text-white bg-gray-900 pt-28">
      <Navbar />

      <h1 className="mb-8 text-3xl font-bold text-center">
        User Management
      </h1>

      {/* EMPTY STATE */}
      {users.length === 0 && (
        <p className="text-center text-gray-400">No users found</p>
      )}

      {/* USER GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="p-5 border backdrop-blur-lg bg-white/10 border-white/20 rounded-xl"
          >
            <h2 className="text-lg font-semibold text-blue-300">
              {u.name}
            </h2>

            <p className="text-sm text-gray-300">{u.email}</p>

            <p className="mt-2 text-yellow-400">{u.role}</p>

            {/* Don't allow deleting admin */}
            {u.role !== "ROLE_ADMIN" && (
              <button
                onClick={() => handleDelete(u.id)}
                className="w-full py-1 mt-4 text-red-300 transition border rounded bg-red-500/20 border-red-400/30 hover:bg-red-500/40"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminUsers;