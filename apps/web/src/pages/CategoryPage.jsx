import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { assetUrl } from "../lib/api";

const money = (value) => new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 0
}).format(value || 0);

function GridIcon({ columns }) {
  return (
    <span
      className="grid h-7 w-7 gap-[3px]"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      aria-hidden="true"
    >
      {Array.from({ length: columns * 3 }).map((_, index) => (
        <i key={index} className="rounded-[2px] bg-current" />
      ))}
    </span>
  );
}

function ProductCard({ product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const image = selectedColor?.imageUrl || product.imageUrl;
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;
  const installment = Math.ceil(product.price / 3);

  return (
    <article className="group mx-auto flex w-full max-w-[350px] min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e4e4e4] bg-[#fbfbfb] shadow-[0_2px_8px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(15,23,42,0.10)]">
      <Link
        to={`/products/${product.slug}`}
        className="relative flex h-[215px] items-center justify-center border-b border-[#e8e8e8] bg-[#f8f8fa] p-5 sm:h-[235px]"
      >
        {discount > 0 ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-black text-white shadow-sm">
            {discount}% OFF
          </span>
        ) : null}
        {image ? (
          <img
            key={image}
            src={assetUrl(image)}
            alt={`${product.name}${selectedColor ? ` in ${selectedColor.name}` : ""}`}
            className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-dashed border-slate-300 text-xs font-semibold text-slate-400">
            Image soon
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
        {product.colors?.length ? (
          <div className="min-h-[52px] text-center">
            <div className="mx-auto flex max-w-full items-center justify-center gap-2 overflow-x-auto px-1 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {product.colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  title={color.name}
                  aria-label={`Show ${product.name} in ${color.name}`}
                  aria-pressed={selectedColor?.id === color.id}
                  onClick={() => setSelectedColor(color)}
                  className={`relative h-7 w-7 shrink-0 rounded-full border-[3px] bg-white p-[2px] transition duration-200 hover:scale-110 ${selectedColor?.id === color.id ? "border-emerald-700 shadow-[0_0_0_2px_rgba(4,120,87,0.18)]" : "border-white shadow-[0_0_0_1px_rgba(100,116,139,0.28)]"}`}
                >
                  <span
                    className="block h-full w-full rounded-full border border-black/15"
                    style={{ backgroundColor: color.hexCode || "#d7d7d7" }}
                  />
                  {selectedColor?.id === color.id ? (
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[11px] font-black text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.85)]">✓</span>
                  ) : null}
                </button>
              ))}
            </div>
            <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-500">
              {selectedColor?.name}
            </p>
          </div>
        ) : (
          <div className="min-h-[52px]" />
        )}

        <Link to={`/products/${product.slug}`} className="mt-1.5 block text-center">
          <h2 className="line-clamp-2 min-h-[2.6rem] text-[16px] font-medium leading-5 text-[#303030] transition group-hover:text-emerald-800">
            {product.name}
          </h2>
        </Link>

        <div className="mt-2 min-h-6 text-center">
          {product.compareAtPrice ? (
            <span className="text-[14px] font-medium text-[#aaa] line-through decoration-2">
              {money(product.compareAtPrice)}
            </span>
          ) : (
            <span className="text-xs text-transparent">Regular price</span>
          )}
        </div>

        <div className="mt-1.5 rounded-xl border border-slate-800 bg-white px-3 py-3 text-center">
          <strong className="block text-[20px] font-black tracking-tight text-[#12459b] sm:text-[22px]">
            {money(product.price)}
          </strong>
          <span className="mt-0.5 block text-[12px] font-extrabold text-slate-900">
            Cash Discount Price
          </span>
        </div>

        <div className="mt-3 text-center">
          <span className="block text-xs text-slate-400">or</span>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-1 text-[13px] text-slate-500">
            <span>3 X</span>
            <strong className="text-[15px] font-black text-[#12459b]">{money(installment)}</strong>
            <span>with</span>
            <img src="/assets/payments/koko.png" alt="Koko" className="h-4 w-auto object-contain" />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2 border-t border-slate-200 pt-3 text-[11px] font-semibold">
          <span className={`h-2 w-2 rounded-full ${product.stockQuantity > 0 ? "bg-emerald-500" : "bg-red-400"}`} />
          <span className={product.stockQuantity > 0 ? "text-emerald-700" : "text-red-600"}>
            {product.stockQuantity > 0 ? "In stock" : "Out of stock"}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function CategoryPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("popular");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 12;
  const [page, setPage] = useState(1);
  const [columns, setColumns] = useState(4);

  useEffect(() => {
    setData(null);
    setError("");
    setPage(1);
    setSearchInput("");
    setSearchQuery("");
    api.get(`/catalog/categories/${slug}`)
      .then((response) => setData(response.data))
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load this category."));
  }, [slug]);

  const sortedProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const products = [...(data?.products || [])].filter(product =>
      !normalizedSearch || product.name.toLowerCase().includes(normalizedSearch)
    );
    if (sort === "price-low") return products.sort((a, b) => a.price - b.price);
    if (sort === "price-high") return products.sort((a, b) => b.price - a.price);
    if (sort === "name") return products.sort((a, b) => a.name.localeCompare(b.name));
    return products.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }, [data, sort, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
  const visibleProducts = sortedProducts.slice((page - 1) * pageSize, page * pageSize);
  const firstResult = sortedProducts.length ? (page - 1) * pageSize + 1 : 0;
  const lastResult = Math.min(page * pageSize, sortedProducts.length);
  const gridClass = columns === 2
    ? "grid-cols-1 sm:grid-cols-2"
    : columns === 3
      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4";

  if (error) {
    return <main className="section-shell py-24"><h1 className="text-4xl font-light">Category unavailable</h1><p className="mt-4 text-slate-500">{error}</p></main>;
  }

  if (!data) {
    return <main className="site-soft-band py-16"><div className="px-5 md:px-8"><div className="h-10 w-64 animate-pulse rounded-xl bg-slate-200" /><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">{[1,2,3,4].map(item => <div key={item} className="h-[650px] animate-pulse rounded-2xl bg-slate-200" />)}</div></div></main>;
  }

  return (
    <main className="site-soft-band min-h-[70vh] pb-20">
      <section className="px-5 pb-6 pt-9 md:px-8 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0 md:max-w-[38%]">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">{data.category.brand || "LuckyZone"}</p>
            <h1 className="mt-2 text-3xl font-medium tracking-[-0.04em] text-[#292929] lg:text-4xl">{data.category.name}</h1>
            {data.category.description ? <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">{data.category.description}</p> : null}
          </div>

          <div className="flex min-w-0 flex-col gap-3 md:items-end">
            <p className="text-sm font-medium text-slate-700 md:text-right">
              Showing {firstResult}{lastResult > firstResult ? `–${lastResult}` : ""} of {sortedProducts.length} results
            </p>
            <div className="flex flex-wrap items-center gap-3 lg:gap-4">
              <form
                className="flex h-[44px] min-w-[230px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100"
                onSubmit={event => {
                  event.preventDefault();
                  setSearchQuery(searchInput);
                  setPage(1);
                }}
              >
                <input
                  type="search"
                  value={searchInput}
                  onChange={event => {
                    const value = event.target.value;
                    setSearchInput(value);
                    setSearchQuery(value);
                    setPage(1);
                  }}
                  placeholder="Search item name..."
                  aria-label="Search products by item name"
                  className="min-w-0 flex-1 border-0 bg-transparent px-3.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="flex w-11 shrink-0 items-center justify-center bg-emerald-800 text-white transition hover:bg-emerald-900"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="6.5" />
                    <path d="m16 16 4.5 4.5" strokeLinecap="round" />
                  </svg>
                </button>
              </form>

              <div className="hidden items-center gap-1 md:flex" aria-label="Grid columns">
                {[2, 3, 4].map(count => (
                  <button key={count} type="button" aria-label={`${count} columns`} onClick={() => setColumns(count)} className={`rounded p-0.5 transition ${columns === count ? "text-slate-800" : "text-slate-300 hover:text-slate-500"}`}><GridIcon columns={count} /></button>
                ))}
              </div>

              <select value={sort} onChange={event => { setSort(event.target.value); setPage(1); }} className="min-w-[190px] rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-emerald-600 lg:min-w-[210px]">
                <option value="popular">Sort by popularity</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="name">Sort by name</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-6 lg:px-8">
        {visibleProducts.length ? (
          <div className={`grid gap-5 ${gridClass}`}>
            {visibleProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-24 text-center">
            <h2 className="text-2xl font-medium text-slate-800">{searchQuery ? "No matching items found" : "No items published yet"}</h2>
            <p className="mt-3 text-sm text-slate-500">{searchQuery ? `No product name matches “${searchQuery}”. Try another item name.` : "Products added and published from the admin panel will appear here automatically."}</p>
            {searchQuery ? <button type="button" onClick={() => { setSearchInput(""); setSearchQuery(""); setPage(1); }} className="mt-5 rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-900">Clear search</button> : null}
          </div>
        )}

        {totalPages > 1 ? (
          <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Product pages">
            <button type="button" disabled={page === 1} onClick={() => setPage(current => current - 1)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 disabled:opacity-40">Previous</button>
            {Array.from({ length: totalPages }).map((_, index) => <button key={index} type="button" onClick={() => setPage(index + 1)} className={`h-10 w-10 rounded-lg text-sm font-bold ${page === index + 1 ? "bg-emerald-800 text-white" : "border border-slate-200 bg-white text-slate-600"}`}>{index + 1}</button>)}
            <button type="button" disabled={page === totalPages} onClick={() => setPage(current => current + 1)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 disabled:opacity-40">Next</button>
          </nav>
        ) : null}
      </section>
    </main>
  );
}
