import { Route, Routes } from "react-router-dom";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";

export default function App() {
  return (
    <div className="site-soft-green flex h-screen flex-col overflow-hidden text-ink">
      <SiteHeader />
      <div className="site-scroll-area flex-1 overflow-y-auto overflow-x-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories/:slug" element={<CategoryPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}
