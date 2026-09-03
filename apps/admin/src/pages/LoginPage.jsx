import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { getStoredToken, storeSession } from "../lib/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (getStoredToken()) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { data } = await api.post("/admin/login", form);
      storeSession(data.token, data.admin);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Sign in failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-forest to-slate-900 px-4">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-forest/60">
          Admin Access
        </p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">LuckyZone</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          Sign in to manage products, categories, banners, and homepage sections.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-forest"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-forest"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
          />
          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
          <button
            className="w-full rounded-2xl bg-gradient-to-r from-citrus to-ember px-4 py-3 font-bold text-slate-950 disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Default admin login</p>
          <p>Email: admin@luckyzone.com</p>
          <p>Password: Admin@123</p>
        </div>
      </div>
    </main>
  );
}
