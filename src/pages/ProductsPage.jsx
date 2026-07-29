import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import GlobalFilterPanel from '../components/GlobalFilterPanel';
import { useAdmin } from '../context/AdminContext';
import styles from './ProductsPage.module.css';

const CATEGORIES = [
  'View all', 'Viggie Collection', 'Bestselling', '2024 Collection', 
  'BOLD Collection', 'Blue Light Lenses', 'Tinted Lenses', 'Gifts'
];

const ProductsPage = () => {
  const { products, loading } = useAdmin();
  const [activeCategory, setActiveCategory] = useState('View all');
  const [visibleCount, setVisibleCount] = useState(16);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    frameColor: [],
    lensColor: [],
    material: [],
    shape: []
  });
  const [sortBy, setSortBy] = useState('Newest');

  const filteredProducts = useMemo(() => {
    return (products || []).filter(product => {
      // If a category has selected filters, the product must match at least one of them.
      for (const [category, values] of Object.entries(selectedFilters)) {
        if (values.length > 0) {
          if (!values.includes(product[category])) {
            return false;
          }
        }
      }
      return true;
    });
  }, [selectedFilters, products]);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 16, filteredProducts.length));
  };

  const handleFilterChange = (category, value) => {
    setSelectedFilters(prev => {
      const current = prev[category] || [];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
    // Reset visible count when filter changes
    setVisibleCount(16);
  };

  const removeFilter = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item !== value)
    }));
  };

  return (
    <div className={styles.page}>
      {/* Options Bar */}
      <div className={styles.optionsBarWrapper}>
        <div className={styles.optionsBar}>
          <div className={styles.pillContainer}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.pillBtn} ${activeCategory === cat ? styles.pillActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <button 
            className={styles.filterBtn} 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            FILTER 
            {isFilterOpen ? <X size={20} strokeWidth={1.5} /> : <SlidersHorizontal size={20} strokeWidth={1.5} />}
          </button>
        </div>

        {/* Global Filter Panel drops down from here */}
        <GlobalFilterPanel 
          isOpen={isFilterOpen}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filteredCount={filteredProducts.length}
          onClose={() => setIsFilterOpen(false)}
          removeFilter={removeFilter}
        />
      </div>

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>ALL GLASSES</h1>
        <p className={styles.subtitle}>
          Experience optical selections that convey a modern aesthetic feel.
        </p>
      </div>

      {/* Product Grid */}
      <div className={styles.productGrid}>
          {loading ? (
            <div style={{ gridColumn: '1 / -1', padding: '64px', textAlign: 'center', color: '#888' }}>
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '64px', textAlign: 'center', color: '#888' }}>
              No products match your filters.
            </div>
          ) : (
            filteredProducts.slice(0, visibleCount).map((product) => {
              const formattedPrice = (product.price || '').toString().includes('฿') 
                ? product.price 
                : `฿ ${(parseInt(product.price || 0)).toLocaleString()}.00`;
                
              return (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  image={product.image}
                  name={product.name}
                  price={formattedPrice}
                  status={product.status === 'In Stock' ? null : product.status}
                />
              );
            })
          )}</div>

      {/* Load More */}
      {visibleCount < filteredProducts.length && (
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

export default ProductsPage;
