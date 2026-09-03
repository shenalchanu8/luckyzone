import { useEffect, useMemo, useState } from "react";
import api, { assetUrl, uploadImage } from "../lib/api";

const blankColor = () => ({ name: "", hexCode: "#111111", images: [] });
const blankForm = () => ({ categoryId: "", name: "", slug: "", shortDescription: "", description: "", regularPrice: "", discountPercent: 0, stockQuantity: 0, isFeatured: false, isPublished: true, colors: [blankColor()] });

function money(value) { return new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(value || 0); }

export default function ProductsPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingColor, setUploadingColor] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const finalPrice = useMemo(() => {
    const regular = Number(form.regularPrice) || 0;
    const discount = Math.min(100, Math.max(0, Number(form.discountPercent) || 0));
    return Math.round((regular * (100 - discount) / 100) * 100) / 100;
  }, [form.regularPrice, form.discountPercent]);

  async function load() {
    const [categoryResponse, productResponse] = await Promise.all([api.get("/admin/categories"), api.get("/admin/products")]);
    setCategories(categoryResponse.data.categories); setProducts(productResponse.data.products);
  }
  useEffect(() => { load().catch(() => setError("Unable to load catalog data.")); }, []);

  function updateColor(index, patch) { setForm(current => ({ ...current, colors: current.colors.map((color, i) => i === index ? { ...color, ...patch } : color) })); }

  async function addImages(index, files) {
    if (!files.length) return; setUploadingColor(index); setError("");
    try {
      const urls = [];
      for (const file of files) urls.push(await uploadImage(file));
      setForm(current => ({ ...current, colors: current.colors.map((color, i) => i === index ? { ...color, images: [...color.images, ...urls] } : color) }));
    } catch (requestError) { setError(requestError.response?.data?.message || "Image upload failed."); }
    finally { setUploadingColor(null); }
  }

  async function edit(id) {
    setError(""); setMessage("");
    try {
      const { data } = await api.get(`/admin/products/${id}`); const product = data.product;
      const regular = product.compareAtPrice || product.price;
      const discount = regular > 0 ? Math.round((1 - product.price / regular) * 10000) / 100 : 0;
      setEditingId(id); setForm({ categoryId: product.categoryId, name: product.name, slug: product.slug, shortDescription: product.shortDescription || "", description: product.description || "", regularPrice: regular, discountPercent: discount, stockQuantity: product.stockQuantity, isFeatured: product.isFeatured, isPublished: product.isPublished, colors: data.colors.length ? data.colors : [blankColor()] });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch { setError("Unable to load this product."); }
  }

  async function submit(event) {
    event.preventDefault(); setSaving(true); setError(""); setMessage("");
    const payload = { categoryId: Number(form.categoryId), name: form.name, slug: form.slug, shortDescription: form.shortDescription, description: form.description, price: finalPrice, compareAtPrice: Number(form.discountPercent) > 0 ? Number(form.regularPrice) : null, stockQuantity: Number(form.stockQuantity), isFeatured: form.isFeatured, isPublished: form.isPublished, colors: form.colors };
    try {
      const response = editingId ? await api.put(`/admin/products/${editingId}`, payload) : await api.post("/admin/products", payload);
      setMessage(response.data.message); setEditingId(null); setForm(blankForm()); await load();
    } catch (requestError) { setError(requestError.response?.data?.message || "Unable to save product."); }
    finally { setSaving(false); }
  }

  async function remove(product) {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    try { await api.delete(`/admin/products/${product.id}`); await load(); }
    catch { setError("Unable to delete product."); }
  }

  return (
    <main className="admin-page">
      <div className="page-heading"><div><p className="eyebrow">Inventory</p><h1>Products</h1><p>Add an item, select its category, set pricing and discount, then attach the correct photos to every available color.</p></div></div>
      <form className="admin-card mt-8" onSubmit={submit}>
        <div className="card-heading"><div><h2>{editingId ? "Edit product" : "Add new product"}</h2><p>Published products become visible under the selected client-side category.</p></div></div>
        <div className="form-grid mt-6">
          <label><span>Item name *</span><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="iPhone 17 Pro Max" /></label>
          <label><span>Category *</span><select required value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}><option value="">Select a category</option>{categories.filter(c => c.isActive).map(c => <option value={c.id} key={c.id}>{c.brand ? `${c.brand} · ` : ""}{c.name}</option>)}</select></label>
          <label><span>URL slug</span><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Auto-created from item name" /></label>
          <label><span>Stock quantity</span><input min="0" type="number" value={form.stockQuantity} onChange={e => setForm({ ...form, stockQuantity: e.target.value })} /></label>
          <label className="md:col-span-2"><span>Short description</span><input value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} placeholder="One-line summary for product cards" /></label>
          <label className="md:col-span-2"><span>Full description</span><textarea rows="4" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
        </div>

        <div className="price-panel mt-7">
          <label><span>Regular price (LKR) *</span><input required min="0" step="0.01" type="number" value={form.regularPrice} onChange={e => setForm({ ...form, regularPrice: e.target.value })} placeholder="499990" /></label>
          <label><span>Discount (%)</span><input min="0" max="100" step="0.01" type="number" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: e.target.value })} /></label>
          <div className="final-price"><span>Final customer price</span><strong>{money(finalPrice)}</strong><small>{Number(form.discountPercent) > 0 ? `${form.discountPercent}% off` : "No discount"}</small></div>
        </div>

        <section className="mt-8">
          <div className="card-heading"><div><h2>Colors & matching images</h2><p>Create each color separately and upload only the images that show that color.</p></div><button type="button" className="secondary-button" onClick={() => setForm({ ...form, colors: [...form.colors, blankColor()] })}>+ Add color</button></div>
          <div className="mt-5 space-y-5">{form.colors.map((color, index) => <div className="color-card" key={index}>
            <div className="grid gap-4 md:grid-cols-[1fr_180px_auto] md:items-end"><label><span>Color name *</span><input required value={color.name} onChange={e => updateColor(index, { name: e.target.value })} placeholder="Natural Titanium" /></label><label><span>Color swatch</span><div className="color-input"><input type="color" value={color.hexCode || "#111111"} onChange={e => updateColor(index, { hexCode: e.target.value })} /><code>{color.hexCode}</code></div></label>{form.colors.length > 1 ? <button type="button" className="table-button danger mb-0.5" onClick={() => setForm({ ...form, colors: form.colors.filter((_, i) => i !== index) })}>Remove color</button> : <span />}</div>
            <label className="mt-4 block"><span>Images for {color.name || `color ${index + 1}`} *</span><input className="mt-2" type="file" accept="image/*" multiple onChange={e => addImages(index, [...e.target.files])} /></label>
            {uploadingColor === index ? <p className="mt-3 text-sm text-slate-500">Uploading images...</p> : null}
            <div className="mt-4 flex flex-wrap gap-3">{color.images.map((image, imageIndex) => <div className="image-chip" key={`${image}-${imageIndex}`}><img src={assetUrl(image)} alt={color.name} /><button type="button" title="Remove image" onClick={() => updateColor(index, { images: color.images.filter((_, i) => i !== imageIndex) })}>×</button>{imageIndex === 0 ? <span>Primary</span> : null}</div>)}</div>
          </div>)}</div>
        </section>

        <div className="mt-6 flex flex-wrap gap-6"><label className="check-label"><input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} />Publish on client site</label><label className="check-label"><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />Featured product</label></div>
        {error ? <p className="form-error">{error}</p> : null}{message ? <p className="form-success">{message}</p> : null}
        <div className="mt-7 flex gap-3"><button disabled={saving || uploadingColor !== null} className="primary-button">{saving ? "Saving product..." : editingId ? "Save product" : "Add product"}</button>{editingId ? <button className="secondary-button" type="button" onClick={() => { setEditingId(null); setForm(blankForm()); }}>Cancel</button> : null}</div>
      </form>

      <section className="admin-card mt-8"><div className="card-heading"><div><h2>All products</h2><p>{products.length} items in the catalog</p></div></div><div className="mt-5 overflow-x-auto"><table><thead><tr><th>Item</th><th>Category</th><th>Price</th><th>Colors</th><th>Status</th><th></th></tr></thead><tbody>{products.map(product => <tr key={product.id}><td><div className="flex items-center gap-3">{product.imageUrl ? <img src={assetUrl(product.imageUrl)} className="h-14 w-14 rounded-xl bg-slate-50 object-contain" /> : <span className="h-14 w-14 rounded-xl bg-slate-100" />}<div><strong>{product.name}</strong><small>{product.stockQuantity} in stock</small></div></div></td><td>{product.categoryName}</td><td><strong>{money(product.price)}</strong>{product.compareAtPrice ? <small className="line-through">{money(product.compareAtPrice)}</small> : null}</td><td>{product.colorCount}</td><td><span className={product.isPublished ? "status live" : "status"}>{product.isPublished ? "Published" : "Draft"}</span></td><td><div className="flex justify-end gap-2"><button className="table-button" onClick={() => edit(product.id)}>Edit</button><button className="table-button danger" onClick={() => remove(product)}>Delete</button></div></td></tr>)}</tbody></table></div></section>
    </main>
  );
}
