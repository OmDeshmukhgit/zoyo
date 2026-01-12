import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zomato-lightGray flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zomato-borderGray p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black bg-gradient-to-r from-zomato-red to-zomato-orange bg-clip-text text-transparent mb-2">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-zomato-textDark/70">
            {mode === "login"
              ? "Sign in to manage restaurants and leave reviews."
              : "Join to add, review and favorite restaurants."}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-bold text-zomato-darker mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-zomato-red/30 rounded-xl focus:outline-none focus:ring-4 focus:ring-zomato-red/40 focus:border-zomato-red"
                placeholder="Priya Sharma"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-zomato-darker mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-zomato-red/30 rounded-xl focus:outline-none focus:ring-4 focus:ring-zomato-red/40 focus:border-zomato-red"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-zomato-darker mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-3 border-2 border-zomato-red/30 rounded-xl focus:outline-none focus:ring-4 focus:ring-zomato-red/40 focus:border-zomato-red"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-zomato-red to-zomato-orange text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
          >
            {isSubmitting ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zomato-textSecondary">
          {mode === "login" ? (
            <>
              New user?{" "}
              <button className="text-zomato-red font-semibold" onClick={() => setMode("register")}>
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button className="text-zomato-red font-semibold" onClick={() => setMode("login")}>
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

