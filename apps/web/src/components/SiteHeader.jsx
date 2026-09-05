import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  {
    label: "Devices",
    href: "/categories/mobile-phones",
    items: [
      { label: "Mobile Phones", description: "Shop smart devices", href: "/categories/mobile-phones" },
      { label: "Smart Watch", description: "Shop wearable tech", href: "/categories/smart-watch" },
      { label: "AirPods", description: "Shop wireless audio", href: "/categories/airpods" },
      { label: "Headsets", description: "Shop headsets and audio", href: "/categories/headsets" },
      { label: "Accessories", description: "Shop device accessories", href: "/categories/other-accessories" },
      { label: "Power Banks", description: "Shop portable charging", href: "/categories/power-banks" }
    ]
  },
  {
    label: "Phone",
    href: "/categories/iphone",
    items: [
      { label: "iPhone", description: "Explore Apple iPhone", href: "/categories/iphone" },
      { label: "Samsung Phones", description: "Explore Samsung Galaxy", href: "/categories/samsung-phones" }
    ]
  },
  {
    label: "Tablet",
    href: "/categories/ipad",
    items: [
      { label: "iPad", description: "Explore Apple iPad", href: "/categories/ipad" },
      { label: "Samsung Tablets", description: "Explore Galaxy Tab", href: "/categories/samsung-tablets" }
    ]
  },
  {
    label: "Laptop",
    href: "/categories/mac",
    items: [
      { label: "MacBook & Mac", description: "MacBook, iMac and Mac", href: "/categories/mac" }
    ]
  },
  {
    label: "AirPods",
    href: "/categories/airpods",
    items: [
      { label: "Apple AirPods", description: "AirPods and AirPods Pro", href: "/categories/airpods" },
      { label: "Samsung Earbuds", description: "Explore Galaxy Buds", href: "/categories/samsung-earbuds" },
      { label: "Samsung Headsets", description: "Headsets and audio", href: "/categories/samsung-headsets" }
    ]
  },
  {
    label: "Watch",
    href: "/categories/watch",
    items: [
      { label: "Apple Watch", description: "Explore Apple Watch", href: "/categories/watch" },
      { label: "Samsung Watches", description: "Explore Galaxy Watch", href: "/categories/samsung-watches" }
    ]
  },
  {
    label: "Accessories",
    href: "/categories/accessories",
    items: [
      { label: "Apple Accessories", description: "Cases, chargers and more", href: "/categories/accessories" },
      { label: "Samsung Accessories", description: "Galaxy accessories", href: "/categories/samsung-accessories" },
      { label: "Other Accessories", description: "More mobile accessories", href: "/categories/other-accessories" }
    ]
  }
];

function SearchIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="6.5" /><path d="M16 16L21 21" strokeLinecap="round" /></svg>;
}

function AccountIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c1.6-3.2 4-4.8 7-4.8s5.4 1.6 7 4.8" strokeLinecap="round" /></svg>;
}

function CartIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 7h12l-1 11H8L7 7Z" strokeLinejoin="round" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>;
}

function Chevron({ open = false }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="m3.5 6 4.5 4 4.5-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const [desktopOpenGroup, setDesktopOpenGroup] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenGroup(null);
    setDesktopOpenGroup(null);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white px-3 py-3 xl:border-b xl:border-slate-200 xl:bg-white/95 xl:px-0 xl:py-0 xl:shadow-[0_1px_10px_rgba(15,23,42,0.03)] xl:backdrop-blur-xl">
      <div className="mx-auto flex min-h-[60px] w-full items-center justify-between gap-3 rounded-full border border-emerald-100 bg-white px-3 sm:min-h-[66px] sm:px-4 md:px-5 xl:min-h-[82px] xl:rounded-none xl:border-0 xl:bg-transparent xl:px-10 2xl:px-20">
        <Link to="/" className="flex h-12 shrink-0 items-center rounded-full bg-white px-4 xl:h-auto xl:bg-transparent xl:px-0" aria-label="LuckyZone home">
          <img src="/assets/logo-transparent.png" alt="LuckyZone" className="h-7 w-auto object-contain sm:h-8 xl:h-14" />
        </Link>

        <nav className="hidden min-w-0 items-center justify-center gap-4 xl:flex 2xl:gap-8" aria-label="Main navigation">
          <Link to="/" className="text-[14px] font-semibold text-slate-700 transition hover:text-forest 2xl:text-[15px]">Home</Link>
          {navItems.map((item, index) => {
            const isDesktopOpen = desktopOpenGroup === index;
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setDesktopOpenGroup(index)}
                onMouseLeave={() => setDesktopOpenGroup(null)}
                onFocus={() => setDesktopOpenGroup(index)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setDesktopOpenGroup(null);
                  }
                }}
              >
                <Link
                  to={item.href}
                  onClick={() => setDesktopOpenGroup(null)}
                  className={`flex items-center gap-1.5 py-3 text-[14px] font-semibold text-slate-700 transition hover:text-forest 2xl:text-[15px] ${isDesktopOpen ? "text-forest" : ""}`}
                >
                  {item.label}
                  <Chevron open={isDesktopOpen} />
                </Link>
                <div className={`absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-2 transition duration-200 ${isDesktopOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0"}`}>
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_22px_60px_rgba(15,23,42,0.16)]">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        onClick={() => setDesktopOpenGroup(null)}
                        className="block rounded-xl px-4 py-3 transition hover:bg-emerald-50 focus-visible:bg-emerald-50 focus-visible:outline-none"
                      >
                        <span className="block text-sm font-bold text-slate-800">{subItem.label}</span>
                        <span className="mt-0.5 block text-xs text-slate-500">{subItem.description}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          <Link to="/" className="whitespace-nowrap text-[14px] font-semibold text-slate-700 transition hover:text-forest 2xl:text-[15px]">Pre-Owned</Link>
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2 xl:gap-4 2xl:gap-5">
          <button type="button" aria-label="Search" className="flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 hover:text-forest xl:h-10 xl:w-10 xl:text-slate-800 xl:hover:bg-slate-100 xl:hover:text-forest"><SearchIcon /></button>
          <button type="button" aria-label="Account" className="hidden h-11 w-11 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 hover:text-forest sm:flex xl:h-10 xl:w-10 xl:text-slate-800 xl:hover:bg-slate-100 xl:hover:text-forest"><AccountIcon /></button>
          <button type="button" aria-label="Cart" className="hidden h-11 w-11 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 hover:text-forest md:flex xl:h-10 xl:w-10 xl:text-slate-800 xl:hover:bg-slate-100 xl:hover:text-forest"><CartIcon /></button>
          <button
            type="button"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="responsive-navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="ml-1 flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 hover:text-forest xl:hidden"
          >
            <span className="relative block h-5 w-5">
              <span className={`absolute left-0 top-[3px] h-0.5 w-5 rounded bg-current transition duration-200 ${isMenuOpen ? "translate-y-[6px] rotate-45" : ""}`} />
              <span className={`absolute left-0 top-[9px] h-0.5 w-5 rounded bg-current transition duration-200 ${isMenuOpen ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 top-[15px] h-0.5 w-5 rounded bg-current transition duration-200 ${isMenuOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      <div className={`fixed inset-x-0 bottom-0 top-[84px] z-40 bg-slate-950/30 transition-opacity duration-300 sm:top-[90px] xl:hidden ${isMenuOpen ? "visible opacity-100" : "invisible opacity-0"}`} onClick={() => setIsMenuOpen(false)} aria-hidden="true" />

      <nav
        id="responsive-navigation"
        aria-label="Responsive navigation"
        className={`absolute inset-x-3 top-[calc(100%+0.75rem)] z-50 max-h-[calc(100vh-96px)] overflow-y-auto rounded-[2rem] border border-slate-100 bg-white px-4 pb-8 pt-3 shadow-[0_24px_55px_rgba(15,23,42,0.16)] transition duration-300 sm:inset-x-6 sm:max-h-[calc(100vh-104px)] sm:px-6 md:px-8 xl:hidden ${isMenuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"}`}
      >
        <div className="mx-auto max-w-3xl">
          <Link to="/" className="flex min-h-12 items-center rounded-xl px-3 text-[16px] font-bold text-slate-900 hover:bg-slate-50">Home</Link>
          {navItems.map((item, index) => {
            const isOpen = openGroup === index;
            return (
              <div key={item.label} className="border-t border-slate-100">
                <button type="button" aria-expanded={isOpen} onClick={() => setOpenGroup(isOpen ? null : index)} className="flex min-h-[52px] w-full items-center justify-between rounded-xl px-3 py-3.5 text-left text-[16px] font-bold text-slate-900 transition hover:bg-slate-50">
                  {item.label}
                  <Chevron open={isOpen} />
                </button>
                <div className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="min-h-0">
                    <div className="grid gap-1 pb-3 pl-3 sm:grid-cols-2 sm:pl-4">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.href}
                          to={subItem.href}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setOpenGroup(null);
                          }}
                          className="rounded-xl border border-transparent px-4 py-3 transition hover:border-emerald-100 hover:bg-emerald-50"
                        >
                          <span className="block text-sm font-bold text-slate-800">{subItem.label}</span>
                          <span className="mt-1 block text-xs leading-5 text-slate-500">{subItem.description}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <Link to="/" className="flex min-h-12 items-center border-t border-slate-100 px-3 text-[16px] font-bold text-slate-900 hover:bg-slate-50">Pre-Owned</Link>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:hidden">
            <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"><AccountIcon /> Account</button>
            <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"><CartIcon /> Cart</button>
          </div>
        </div>
      </nav>
    </header>
  );
}
