import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useAdmin } from '../context/AdminContext';
import styles from './BrandPage.module.css';

const BrandPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { brands, products } = useAdmin();
  const [visibleCount, setVisibleCount] = useState(16);

  useEffect(() => {
    window.scrollTo(0, 0);
    setVisibleCount(16);
  }, [id]);

  const brandData = brands.find(b => b.slug === id || b.id === id);

  if (!brandData) {
    // If brand not found, fallback to the first available brand or redirect
    if (brands.length > 0) {
      return <Navigate to={`/brand/${brands[0].slug}`} replace />;
    }
    return <div>Brand not found.</div>;
  }

  const allProducts = products.filter(p => p.brandId === brandData.slug || p.brandId === brandData.id);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 16, allProducts.length));
  };

  return (
    <div className={styles.page}>
      {/* Top Options Bar */}
      <div className={styles.optionsBar}>
        <div className={styles.pillContainer}>
          {brands.map((brand) => (
            <button
              key={brand.id}
              className={`${styles.pillBtn} ${id === brand.slug ? styles.pillActive : ''}`}
              onClick={() => navigate(`/brand/${brand.slug}`)}
            >
              {brand.name}
            </button>
          ))}
        </div>
        
        <button className={styles.filterBtn}>
          Filter <SlidersHorizontal size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <img 
          src={brandData.banner || 'https://images.unsplash.com/photo-1614715838608-dd527c46231d?auto=format&fit=crop&w=2070&q=80'} 
          alt={brandData.name} 
          className={styles.heroImage} 
        />
      </div>

      {/* Text Section */}
      <div className={styles.textSection}>
        <h1 className={styles.mainTitle}>{brandData.name}</h1>
        <p className={styles.subTitle}>{brandData.description}</p>
      </div>

      {/* Product Grid */}
      <div className={styles.productGrid}>
        {allProducts.slice(0, visibleCount).map((product, index) => (
          <ProductCard
            key={`${product.id}-${index}`}
            id={product.id}
            image={product.image}
            name={product.name}
            price={product.price}
            status={product.status}
          />
        ))}
      </div>

      {/* Load More */}
      {visibleCount < allProducts.length && (
        <div className={styles.loadMoreContainer}>
          <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
            Load more
          </button>
          <a href="#" className={styles.viewAllLink}>View all products</a>
        </div>
      )}
    </div>
  );
};

export default BrandPage;
