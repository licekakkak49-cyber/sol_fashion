import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import MinimalFooter from './components/MinimalFooter';
import HomePage from './pages/HomePage';
import BespokeExperiencePage from './pages/BespokeExperiencePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import BespokeDetailPage from './pages/BespokeDetailPage';
import BespokeDynamicPage from './pages/BespokeDynamicPage';
import LensesPage from './pages/LensesPage';
import BrandPage from './pages/BrandPage';
import StoryPage from './pages/StoryPage';
import AccountPage from './pages/AccountPage';
import WishlistModal from './components/WishlistModal';
import WishlistPopup from './components/WishlistPopup';
import LoginDrawer from './components/LoginDrawer';
import StorePage from './pages/StorePage';
import AdminLayout from './pages/admin/AdminLayout';
import ManageBrandsPage from './pages/admin/ManageBrandsPage';
import ManageProductsPage from './pages/admin/ManageProductsPage';
import ManageContentPage from './pages/admin/ManageContentPage';
import ManageContentEditor from './pages/admin/ManageContentEditor';
import { useAdmin } from './context/AdminContext';
import './App.css';

function App() {
  const { isAdminAuthenticated } = useAdmin();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isHomePage = location.pathname === '/';
  const isMinimalFooterPage = isHomePage || location.pathname === '/experience' || location.pathname.startsWith('/experience/') || location.pathname === '/products' || location.pathname.startsWith('/product/') || location.pathname.startsWith('/brand/') || location.pathname === '/story' || location.pathname === '/account' || location.pathname === '/store';

  // Handle opening login drawer from redirect
  React.useEffect(() => {
    if (location.state?.openLogin) {
      setIsLoginOpen(true);
      // Clear the state so it doesn't reopen on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  if (isAdmin) {
    if (!isAdminAuthenticated) {
      // If not authenticated, redirect to home and open login drawer
      return <Navigate to="/" replace state={{ openLogin: true }} />;
    }

    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/products" replace />} />
          <Route path="brands" element={<ManageBrandsPage />} />
          <Route path="products" element={<ManageProductsPage />} />
          <Route path="bespoke" element={<ManageContentPage category="bespoke" pageTitle="Bespoke Experience" pageSubtitle="Manage and organize bespoke editorial pages." />} />
          <Route path="bespoke/:id" element={<ManageContentEditor category="bespoke" backUrl="/admin/bespoke" />} />
          
          <Route path="lenses" element={<ManageContentPage category="lenses" pageTitle="Precision Lenses" pageSubtitle="Manage lens technology and information pages." />} />
          <Route path="lenses/:id" element={<ManageContentEditor category="lenses" backUrl="/admin/lenses" />} />
          
          <Route path="explore" element={<ManageContentPage category="explore" pageTitle="Explore & Stories" pageSubtitle="Manage brand stories, campaigns, and articles." />} />
          <Route path="explore/:id" element={<ManageContentEditor category="explore" backUrl="/admin/explore" />} />
        </Route>
      </Routes>
    );
  }

  return (
    <>
      <Nav isHomePage={isHomePage} onOpenLogin={() => setIsLoginOpen(true)} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/experience" element={<BespokeExperiencePage />} />
          <Route path="/experience/:id" element={<BespokeDetailPage />} />
          <Route path="/bespoke-dynamic" element={<BespokeDynamicPage />} />
          <Route path="/lenses" element={<LensesPage />} />
          <Route path="/lenses/:id" element={<BespokeDetailPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/brand/:id" element={<BrandPage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/story/:id" element={<BespokeDetailPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/store" element={<StorePage />} />
        </Routes>
      </main>
      {isMinimalFooterPage ? <MinimalFooter /> : <Footer />}
      <WishlistPopup />
      <WishlistModal />
      <LoginDrawer isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}

export default App;
