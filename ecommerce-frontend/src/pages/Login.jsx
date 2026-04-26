import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await API.post("/api/auth/login", { email, password });

      // handle both string token or object response
      const token = res.data.token || res.data;

      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (err) {
      alert("Invalid email or password ❌");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="flex items-center justify-center min-h-screen">

      <div className="p-8 border shadow-2xl backdrop-blur-xl bg-white/10 border-white/20 rounded-2xl w-96">

        <h2 className="mb-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
          Welcome Back
        </h2>

        <input
          type="email"
          className="w-full p-3 mb-4 rounded-lg outline-none bg-gray-800/60 focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 mb-4 rounded-lg outline-none bg-gray-800/60 focus:ring-2 focus:ring-blue-400"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full py-2 transition bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Login
        </button>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-2 mt-4 transition rounded-lg bg-red-500/80 hover:bg-red-600"
        >
          Login with Google
        </button>

        {/* REGISTER LINK ADDED */}
        <p className="mt-4 text-sm text-center text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-400 hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;