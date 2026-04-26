import { useNavigate, useLocation } from "react-router-dom";
import { getRole } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = getRole(); 

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-white font-semibold"
      : "text-white/60 hover:text-white";

  return (
    <div className="fixed top-0 left-0 z-50 w-full border-b shadow-lg backdrop-blur-xl bg-black/30 border-white/10">

      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">

        {/* LOGO */}
        <h1
          onClick={() => navigate("/dashboard")}
          className="text-2xl font-bold text-transparent transition cursor-pointer bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text hover:opacity-80"
        >
          E-Commerce
        </h1>

        {/* MENU */}
        <div className="flex items-center gap-8 text-sm">

          <button
            onClick={() => navigate("/dashboard")}
            className={`${isActive("/dashboard")} transition`}
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/add")}
            className={`${isActive("/add")} transition`}
          >
            Add Product
          </button>

          {/* 👑 ADMIN ONLY */}
          {role === "ROLE_ADMIN" && (
            <button
              onClick={() => navigate("/admin/users")}
              className={`${isActive("/admin/users")} transition text-yellow-400 hover:text-yellow-300`}
            >
              Users
            </button>
          )}

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="px-4 py-1 text-red-300 transition-all duration-300 border rounded-lg bg-red-500/20 border-red-400/30 hover:bg-red-500/40 hover:scale-105"
          >
            Logout
          </button>

        </div>

      </div>
    </div>
  );
}

export default Navbar;