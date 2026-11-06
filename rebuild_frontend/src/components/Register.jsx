import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Register({ setMessage, API_URL }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const resetForm = () => setForm({ username: "", email: "", password: "" });
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      let data = {};
      try {
        data = await res.json();
      } catch {
        /* ignore */
      }
      if (res.ok) {
        setMessage("Registration successful! You can now log in.");
        resetForm();
        navigate("/login");
      } else {
        setMessage(data.error || `Registration failed (status ${res.status}).`);
      }
    } catch (err) {
      setMessage(`Error connecting to server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="flex justify-center items-center w-full min-h-[calc(100vh-160px)] bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 overflow-hidden">
      <div className="w-full max-w-md px-4">
        <form
          onSubmit={handleRegister}
          autoComplete="on"
          aria-label="Registration form"
          className="w-full bg-white rounded-2xl shadow-lg p-8 sm:p-10 border border-gray-100
                     transition-all duration-300 focus-within:shadow-xl overflow-hidden"
        >
          {/* === Heading === */}
          <header className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Create an Account
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Register to access the Lost & Found System
            </p>
          </header>
          {/* === Inputs === */}
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                required
                autoComplete="username"
                placeholder="Enter your username"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-[15px]
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                           transition-all duration-150"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="Enter your email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-[15px]
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                           transition-all duration-150"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder="Create a password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-[15px]
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600
                           transition-all duration-150"
              />
            </div>
          </div>
          {/* === Actions === */}
          <div className="mt-6 space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700
                         shadow-md hover:shadow-lg transition-all duration-200
                         disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full py-2.5 rounded-md font-medium border border-gray-300 text-gray-700
                         hover:bg-gray-50 transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Back to Login
            </button>
          </div>
          {/* === Footer === */}
          <footer className="text-center mt-6 text-sm text-gray-500">
            By registering, you agree to our{" "}
            <button
              type="button"
              onClick={() => alert('Terms of Service coming soon')}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={() => alert('Privacy Policy coming soon')}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              Privacy Policy
            </button>.
          </footer>
        </form>
      </div>
    </section>
  );
}