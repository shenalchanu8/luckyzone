import { useEffect, useState } from "react";
import api, { assetUrl, uploadImage } from "../lib/api";

const emptyForm = { name: "", slug: "", brand: "Apple", imageUrl: "", description: "", displayOrder: 0, isFeatured: true, isActive: true };

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await api.get("/admin/categories");
    setCategories(data.categories);
  }

  useEffect(() => { load().catch(() => setError("Unable to load categories.")); }, []);

  function edit(category) {
    setEditingId(category.id);
    setForm({ ...category });
    setMessage(""); setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(event) {
    event.preventDefault(); setSaving(true); setError(""); setMessage("");
    try {
      const response = editingId
        ? await api.put(`/admin/categories/${editingId}`, form)
        : await api.post("/admin/categories", form);
      setMessage(response.data.message); setForm(emptyForm); setEditingId(null); await load();
    } catch (requestError) { setError(requestError.response?.data?.message || "Unable to save category."); }
    finally { setSaving(false); }
  }

  async function remove(category) {
    if (!window.confirm(`Delete ${category.name}?`)) return;
    try { await api.delete(`/admin/categories/${category.id}`); await load(); }
    catch (requestError) { setError(requestError.response?.data?.message || "Unable to delete category."); }
  }

  return (
    <main className="admin-page">
      <div className="page-heading"><div><p className="eyebrow">Catalog structure</p><h1>Categories</h1><p>Add every Apple, Samsung, and accessory category shown on the client website.</p></div></div>
      <form onSubmit={submit} className="admin-card mt-8">
        <div className="card-heading"><div><h2>{editingId ? "Edit category" : "Add a category"}</h2><p>Active categories appear automatically in the storefront menu and category collection.</p></div></div>
        <div className="form-grid mt-6">
          <label><span>Category name *</span><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Samsung Phones" /></label>
          <label><span>URL slug</span><input value={form.slug || ""} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Auto-created from name" /></label>
          <label><span>Brand</span><select value={form.brand || ""} onChange={e => setForm({ ...form, brand: e.target.value })}><option>Apple</option><option>Samsung</option><option>Other</option></select></label>
          <label><span>Display order</span><input type="number" value={form.displayOrder} onChange={e => setForm({ ...form, displayOrder: Number(e.target.value) })} /></label>
          <label className="md:col-span-2"><span>Description</span><textarea rows="3" value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
          <label className="md:col-span-2"><span>Category cover image</span><input type="file" accept="image/*" onChange={async e => { const file=e.target.files?.[0]; if (!file) return; try { setForm({ ...form, imageUrl: await uploadImage(file) }); } catch { setError("Image upload failed."); } }} /></label>
        </div>
        {form.imageUrl ? <img className="mt-4 h-28 w-40 rounded-2xl bg-slate-50 object-contain" src={assetUrl(form.imageUrl)} alt="Category preview" /> : null}
        <div className="mt-5 flex flex-wrap gap-6"><label className="check-label"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />Active on client site</label><label className="check-label"><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />Featured</label></div>
        {error ? <p className="form-error">{error}</p> : null}{message ? <p className="form-success">{message}</p> : null}
        <div className="mt-6 flex gap-3"><button className="primary-button" disabled={saving}>{saving ? "Saving..." : editingId ? "Save changes" : "Add category"}</button>{editingId ? <button type="button" className="secondary-button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button> : null}</div>
      </form>

      <section className="admin-card mt-8 overflow-hidden"><div className="card-heading"><div><h2>All categories</h2><p>{categories.length} catalog categories</p></div></div>
        <div className="mt-5 overflow-x-auto"><table><thead><tr><th>Category</th><th>Brand</th><th>Items</th><th>Status</th><th></th></tr></thead><tbody>{categories.map(category => <tr key={category.id}><td><div className="flex items-center gap-3">{category.imageUrl ? <img src={assetUrl(category.imageUrl)} className="h-12 w-12 rounded-xl bg-slate-50 object-contain" /> : <span className="h-12 w-12 rounded-xl bg-slate-100" />}<div><strong>{category.name}</strong><small>/{category.slug}</small></div></div></td><td>{category.brand || "Other"}</td><td>{category.productCount}</td><td><span className={category.isActive ? "status live" : "status"}>{category.isActive ? "Active" : "Hidden"}</span></td><td><div className="flex justify-end gap-2"><button className="table-button" onClick={() => edit(category)}>Edit</button><button className="table-button danger" onClick={() => remove(category)}>Delete</button></div></td></tr>)}</tbody></table></div>
      </section>
    </main>
  );
}
