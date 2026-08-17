import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, X, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import GlobalFilterPanel from '../components/GlobalFilterPanel';
import { useAdmin } from '../context/AdminContext';
import styles from './ProductsPage.module.css';

const CATEGORIES = [
  'View all', 'New In', 'SOL Fall 2026', 
  'Bags', 'Dresses', 'Tops', 'Bottoms', 'Accessories'
];

const ProductsPage = () => {
  const { products, loading } = useAdmin();
  const [activeCategory, setActiveCategory] = useState('View all');
  const [visibleCount, setVisibleCount] = useState(8);
  
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

  const macroRows = useMemo(() => {
    const rows = [];
    let currentBlock = [];
    let currentCapacity = 4;
    let currentBlocksInRow = []; // Up to 2 blocks per Macro Row (Standard), or 1 block (Wide)
    let currentRowType = null; // 'standard' or 'wide'

    const pushCurrentBlock = () => {
      if (currentBlock.length > 0) {
        currentBlocksInRow.push({ type: currentRowType || 'standard', items: currentBlock });
        currentBlock = [];
        currentCapacity = 4;
      }
      
      const maxBlocks = currentRowType === 'wide' ? 1 : 2;
      
      if (currentBlocksInRow.length === maxBlocks) {
        rows.push({ type: currentRowType || 'standard', blocks: currentBlocksInRow });
        currentBlocksInRow = [];
        currentRowType = null;
      }
    };

    filteredProducts.forEach(product => {
      // Map legacy isLarge to layoutSize
      const layoutSize = product.layoutSize || (product.isLarge ? 'large' : 'small');
      const productType = layoutSize === 'wide' ? 'wide' : 'standard';
      const requiredCapacity = layoutSize === 'large' ? 4 : 1;
      
      if (currentRowType !== null && currentRowType !== productType) {
        pushCurrentBlock();
        if (currentBlocksInRow.length > 0) {
          rows.push({ type: currentRowType, blocks: currentBlocksInRow });
          currentBlocksInRow = [];
        }
      }
      
      currentRowType = productType;
      
      if (requiredCapacity > currentCapacity && currentBlock.length > 0) {
        pushCurrentBlock();
      }

      currentBlock.push(product);
      currentCapacity -= requiredCapacity;

      if (currentCapacity === 0) {
        pushCurrentBlock();
      }
    });

    if (currentBlock.length > 0) {
      currentBlocksInRow.push({ type: currentRowType || 'standard', items: currentBlock });
    }
    if (currentBlocksInRow.length > 0) {
      rows.push({ type: currentRowType || 'standard', blocks: currentBlocksInRow });
    }

    return rows;
  }, [filteredProducts]);

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

  const getCategoryCount = (cat) => {
    if (cat === 'View all') return products?.length || 0;
    const mockCounts = {
      'New In': 24,
      'SOL Fall 2026': 42,
      'Bags': 18,
      'Dresses': 12,
      'Tops': 20,
      'Bottoms': 15,
      'Accessories': 32
    };
    return mockCounts[cat] || 0;
  };

  return (
    <div className={styles.page}>
      {/* Options Bar */}
      <div className={styles.optionsBarWrapper}>
        <div className={styles.optionsBar}>
          <div className={styles.pillScrollWrapper}>
            <div className={styles.pillContainer}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.pillBtn} ${activeCategory === cat ? styles.pillActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
                {activeCategory === cat && (
                  <sup className={styles.categoryCount}>{getCategoryCount(cat)}</sup>
                )}
              </button>
            ))}
            </div>
            <div className={styles.scrollIndicator}>
              <ChevronRight size={14} strokeWidth={2} />
            </div>
          </div>
          
          <div className={styles.rightOptions}>
            <button 
              className={styles.textOptionBtn} 
              onClick={() => setIsFilterOpen(true)}
            >
              Sort By
            </button>
            <button 
              className={styles.textOptionBtn} 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              Filters
            </button>
          </div>
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


      {/* Product Grid based on Bin-Packing Algorithm */}
      <div className={styles.productGridContainer}>
        {macroRows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className={styles.macroRow}>
            {row.blocks.map((block, blockIndex) => {
              const isLargeBlock = block.items.length === 1 && (block.items[0].layoutSize === 'large' || block.items[0].isLarge);
              const blockClass = row.type === 'wide' ? styles.wideBlock : (isLargeBlock ? styles.largeBlock : styles.block);
              return (
                <div key={`block-${rowIndex}-${blockIndex}`} className={blockClass}>
                  {block.items.map((product) => {
                  const layoutSize = product.layoutSize || (product.isLarge ? 'large' : 'small');
                  return (
                    <div 
                      key={product.id} 
                      className={layoutSize === 'large' ? styles.largeCard : styles.standardCard}
                    >
                      <ProductCard 
                        id={product.id}
                        image={product.image}
                        hoverImage={product.hoverImage}
                        name={product.name}
                        price={product.price}
                        tags={product.tags}
                        colors={product.colors}
                        selectedColor={product.selectedColor}
                        extraColorsCount={product.extraColorsCount}
                        isLarge={layoutSize === 'large'}
                      />
                    </div>
                  );
                })}
              </div>
            );
            })}
            {row.type === 'standard' && row.blocks.length === 1 && <div className={styles.blockPlaceholder}></div>}
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className={styles.bottomSection}>
        {visibleCount < filteredProducts.length && (
          <div className={styles.loadMoreContainer}>
            <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
              VIEW MORE
            </button>
          </div>
        )}
        <div className={styles.breadcrumbs}>
          <span>Homepage — Women — </span>
          <span className={styles.currentBreadcrumb}>Beachwear</span>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
