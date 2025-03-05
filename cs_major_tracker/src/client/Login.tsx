import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (localStorage.getItem("authenticated") === "true") {
      navigate("/main");
    }
  }, [navigate]);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data: { success?: boolean; message?: string; username?: string } = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Invalid login");
      } else {
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("username", data.username || "");

        navigate("/main");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Server error occurred.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#AC2B37] text-black font-body">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <img src="/wpi.png" alt="WPI Logo" className="h-12 w-auto mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        {errorMsg && <p className="text-red-500 text-center mb-4">{errorMsg}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center">
          Don’t have an account? <a href="/register" className="text-blue-500">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
