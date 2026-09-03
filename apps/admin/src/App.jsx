import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import { clearSession, getStoredAdmin, getStoredToken } from "./lib/auth";

function AdminShell({ children }) {
  const navigate = useNavigate();
  const admin = getStoredAdmin();

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 bg-slatepanel p-6 text-white lg:block">
        <h1 className="text-2xl font-black text-citrus">LuckyZone Admin</h1>
        <p className="mt-4 text-sm text-white/70">{admin?.email}</p>
        <nav className="mt-10 space-y-3 text-sm text-white/70">
          <Link className="block rounded-xl px-4 py-3 hover:bg-white/10" to="/dashboard">
            Dashboard
          </Link>
          <Link className="block rounded-xl px-4 py-3 hover:bg-white/10" to="/products">
            Products
          </Link>
          <Link className="block rounded-xl px-4 py-3 hover:bg-white/10" to="/categories">
            Categories
          </Link>
          <Link className="block rounded-xl px-4 py-3 hover:bg-white/10" to="/dashboard">
            Banners
          </Link>
        </nav>
        <button
          className="mt-10 rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white"
          onClick={() => {
            clearSession();
            navigate("/login");
          }}
          type="button"
        >
          Sign Out
        </button>
      </aside>
      <div className="lg:pl-72">{children}</div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  if (!getStoredToken()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminShell>
              <DashboardPage />
            </AdminShell>
          </ProtectedRoute>
        }
      />
      <Route path="/products" element={<ProtectedRoute><AdminShell><ProductsPage /></AdminShell></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute><AdminShell><CategoriesPage /></AdminShell></ProtectedRoute>} />
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}
