import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    try {
      await API.post("/api/auth/register", form);
      alert("Registration successful ✅");
      navigate("/"); // go to login
    } catch (err) {
      alert("Registration failed ❌");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black">

      <div className="p-8 border shadow-lg backdrop-blur-xl bg-white/10 border-white/20 rounded-2xl w-96">

        <h2 className="mb-6 text-2xl font-bold text-center text-green-400">
          Create Account
        </h2>

        <input
          placeholder="Full Name"
          className="w-full p-3 mb-3 rounded bg-gray-800/60"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="w-full p-3 mb-3 rounded bg-gray-800/60"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-3 rounded bg-gray-800/60"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleRegister}
          className="w-full py-2 mt-3 transition bg-green-500 rounded hover:bg-green-600"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;