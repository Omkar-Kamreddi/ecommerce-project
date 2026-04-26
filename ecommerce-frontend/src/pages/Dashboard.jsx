import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { getRole } from "../utils/auth";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  const role = getRole();

  useEffect(() => {

    // FIXED: role-based API call
    API.get(
      role === "ROLE_ADMIN"
        ? "/api/products"
        : "/api/products/my"
    )
      .then((res) => setProducts(res.data))
      .catch(() => alert("Unauthorized"));

    // Admin stats
    if (role === "ROLE_ADMIN") {
      API.get("/api/admin/stats")
        .then((res) => setStats(res.data))
        .catch(() => console.log("Admin stats error"));
    }

  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;

    try {
      await API.delete(`/api/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch {
      alert("Not allowed");
    }
  };

  const handleEdit = (product) => {
    localStorage.setItem("editProduct", JSON.stringify(product));
    navigate("/add");
  };

  return (
    <div className="min-h-screen px-8 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-28">

      <Navbar />

      <h1 className="mb-8 text-4xl font-bold tracking-wide text-center">
        Products
      </h1>

      {role === "ROLE_ADMIN" && stats && (
        <div className="flex justify-center gap-10 mb-10">

          <div className="px-6 py-4 text-center border shadow-lg backdrop-blur-xl bg-white/10 border-white/20 rounded-2xl">
            <p className="text-sm text-gray-400">Total Users</p>
            <h2 className="text-2xl font-bold text-blue-300">
              {stats.totalUsers}
            </h2>
          </div>

          <div className="px-6 py-4 text-center border shadow-lg backdrop-blur-xl bg-white/10 border-white/20 rounded-2xl">
            <p className="text-sm text-gray-400">Total Products</p>
            <h2 className="text-2xl font-bold text-green-300">
              {stats.totalProducts}
            </h2>
          </div>

        </div>
      )}

      {products.length === 0 && (
        <p className="text-center text-gray-400">No products available</p>
      )}

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">

        {products.map((p) => (
          <div
            key={p.id}
            className="relative group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 
                       shadow-[0_8px_32px_rgba(31,38,135,0.37)]
                       hover:scale-105 transition-all duration-300"
          >

            <div className="absolute inset-0 transition opacity-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl group-hover:opacity-100"></div>

            <h2 className="relative z-10 text-xl font-semibold text-blue-300">
              {p.name}
            </h2>

            <p className="relative z-10 mt-2 text-gray-300">
              {p.description}
            </p>

            <p className="relative z-10 mt-4 text-lg font-bold text-green-400">
              ₹ {p.price}
            </p>

            {role === "ROLE_ADMIN" && (
              <div className="relative z-10 flex gap-3 mt-5">

                <button
                  onClick={() => handleEdit(p)}
                  className="flex-1 py-1 text-blue-300 transition border rounded-lg bg-blue-500/20 border-blue-400/30 hover:bg-blue-500/40"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="flex-1 py-1 text-red-300 transition border rounded-lg bg-red-500/20 border-red-400/30 hover:bg-red-500/40"
                >
                  Delete
                </button>

              </div>
            )}

          </div>
        ))}

      </div>
    </div>
  );
}

export default Dashboard;