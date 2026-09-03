import { useEffect, useState } from "react";
import api from "../lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSummary() {
      try {
        const { data } = await api.get("/admin/dashboard-summary");
        setStats([
          { label: "Products", value: String(data.products) },
          { label: "Categories", value: String(data.categories) },
          { label: "Homepage Banners", value: String(data.banners) },
          { label: "Draft Items", value: String(data.drafts) }
        ]);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load dashboard.");
      } finally {
        setIsLoading(false);
      }
    }

    loadSummary();
  }, []);

  return (
    <main className="p-6 md:p-10">
      <h1 className="text-4xl font-black text-slate-950">Dashboard</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
        Manage the categories and products that appear automatically on the LuckyZone client website.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {(isLoading ? [{ label: "Loading", value: "..." }] : stats).map((stat) => (
          <section key={stat.label} className="rounded-[1.75rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">
              {stat.label}
            </p>
            <p className="mt-4 text-4xl font-black text-slate-950">{stat.value}</p>
          </section>
        ))}
      </div>

      {error ? (
        <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </section>
      ) : null}

      <section className="mt-10 rounded-[2rem] bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">Catalog management is ready</h2>
        <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
          <li>Add and organize Apple, Samsung, and accessory categories</li>
          <li>Create products with regular price, discount, and final customer price</li>
          <li>Add multiple colors with a separate image gallery for each color</li>
          <li>Publish or save items as drafts</li>
        </ul>
      </section>
    </main>
  );
}
