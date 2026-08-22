import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import GlobalFilterPanel from '../components/GlobalFilterPanel';
import { useAdmin } from '../context/AdminContext';
import styles from './ProductsPage.module.css';

const ProductsPage = ({ previewSets = null }) => {
  const adminCtx = useAdmin();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mainParam = searchParams.get('main');

  const displayCategories = useMemo(() => {
    const contextCats = adminCtx.categories || {};
    const mainCats = Object.keys(contextCats);
    if (mainParam === 'New In') {
      return ['View all', ...mainCats];
    }
    if (mainParam && contextCats[mainParam]) {
      return ['View all', 'New In', ...contextCats[mainParam]];
    }
    return ['View all', 'New In', ...mainCats];
  }, [mainParam, adminCtx.categories]);

  const products = adminCtx.products;
  const sets = previewSets || adminCtx.sets;
  const loading = adminCtx.loading;

  const [activeCategory, setActiveCategory] = useState('View all');
  
  useEffect(() => {
    setActiveCategory('View all');
  }, [mainParam]);
  const [visibleCount, setVisibleCount] = useState(8);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    color: [],
    size: [],
    category: [],
    line: []
  });
  const [sortBy, setSortBy] = useState('Newest');


  const filteredProducts = useMemo(() => {
    return (products || []).filter(product => {
      // 1. Navigation & Category Pill Filtering
      if (mainParam && mainParam !== 'New In' && mainParam !== 'Explore') {
        if (product.mainCategory !== mainParam) return false;
      }
      if (activeCategory && activeCategory !== 'View all' && activeCategory !== 'New In') {
        if (product.subCategory !== activeCategory) return false;
      }
      
      // 2. Sidebar Filters
      for (const [category, values] of Object.entries(selectedFilters)) {
        if (values.length > 0) {
          if (!values.includes(product[category])) {
            return false;
          }
        }
      }
      return true;
    });
  }, [selectedFilters, products, mainParam, activeCategory]);

  const displayGroups = useMemo(() => {
    const buildRows = (items) => {
      const rows = [];
      let currentBlock = [];
      let currentCapacity = 4;
      let currentBlocksInRow = [];
      let currentRowType = null;

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

      items.forEach(product => {
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
    };

    const now = new Date();
    const activeSets = (sets || []).filter(s => {
       // 1. Navigation & Category Pill Filtering
       if (!previewSets) {
         if (mainParam && mainParam !== 'New In' && mainParam !== 'Explore') {
           if (s.mainCategory !== mainParam) return false;
         }
         if (activeCategory && activeCategory !== 'View all' && activeCategory !== 'New In') {
           if (s.subCategory !== activeCategory) return false;
         }
       }
       
       // 2. Status check
       if (previewSets) return true;
       if (s.status === 'published') return true;
       if (s.status === 'scheduled' && s.scheduledDate) {
          return new Date(s.scheduledDate) <= now;
       }
       return false;
    });

    const groups = [];
    let assignedProductIds = new Set();
    let displayProductCount = 0;

    activeSets.forEach(set => {
       const setItems = (set.items || []).map(setItem => {
          const product = filteredProducts.find(p => p.id === setItem.productId);
          if (product) {
             return { ...product, layoutSize: setItem.layoutSize };
          }
          return null;
       }).filter(Boolean);

       if (setItems.length > 0) {
          const visibleSetItems = [];
          for (let item of setItems) {
             if (displayProductCount < visibleCount) {
                visibleSetItems.push(item);
                assignedProductIds.add(item.id);
                displayProductCount++;
             }
          }
          
          if (visibleSetItems.length > 0) {
             groups.push({
               type: 'set',
               id: set.id,
               rows: buildRows(visibleSetItems)
             });
          }
       }
    });

    const unassignedItems = [];
    for (let product of filteredProducts) {
       if (!assignedProductIds.has(product.id) && displayProductCount < visibleCount) {
          unassignedItems.push(product);
          displayProductCount++;
       }
    }

    if (unassignedItems.length > 0) {
       groups.push({
          type: 'unassigned',
          id: 'unassigned',
          rows: buildRows(unassignedItems)
       });
    }

    return groups;
  }, [filteredProducts, sets, visibleCount, previewSets, mainParam, activeCategory]);

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

  const clearAllFilters = () => {
    setSelectedFilters({
      color: [],
      size: [],
      category: [],
      line: []
    });
    setVisibleCount(16);
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
{!previewSets && (
        <>
      {/* Options Bar */}
      <div className={styles.optionsBarWrapper}>
        <div className={styles.optionsBar}>
          <div className={styles.pillScrollWrapper}>
            <div className={styles.pillContainer}>
            {displayCategories.map((cat) => (
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
            <div className={styles.sortDropdownContainer}>
              <button 
                className={`${styles.textOptionBtn} ${isSortOpen ? styles.textOptionBtnActive : ''}`} 
                onClick={() => {
                  setIsSortOpen(!isSortOpen);
                  setIsFilterOpen(false);
                }}
              >
                Sort By
              </button>
              
              <AnimatePresence>
                {isSortOpen && (
                  <motion.div 
                    className={styles.sortDropdownContent}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button 
                       className={`${styles.sortDropdownItem} ${sortBy === 'price-desc' ? styles.sortDropdownItemActive : ''}`}
                       onClick={() => { setSortBy('price-desc'); setIsSortOpen(false); }}
                    >
                      PRICE : HIGH-TO-LOW
                    </button>
                    <button 
                       className={`${styles.sortDropdownItem} ${sortBy === 'price-asc' ? styles.sortDropdownItemActive : ''}`}
                       onClick={() => { setSortBy('price-asc'); setIsSortOpen(false); }}
                    >
                      PRICE : LOW TO HIGH
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              className={`${styles.textOptionBtn} ${isFilterOpen ? styles.textOptionBtnActive : ''}`} 
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                setIsSortOpen(false);
              }}
            >
              Filters
            </button>
          </div>
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
          onClearAll={clearAllFilters}
        />
        </>
      )}

      {/* Product Grid based on Bin-Packing Algorithm grouped by Sets */}
      <div className={styles.productGridContainer}>
        {displayGroups.map(group => (
          <React.Fragment key={group.id}>
            {group.rows.map((row, rowIndex) => (
              <div key={`row-${group.id}-${rowIndex}`} className={styles.macroRow}>
                {row.blocks.map((block, blockIndex) => {
                  const isLargeBlock = block.items.length === 1 && (block.items[0].layoutSize === 'large' || block.items[0].isLarge);
                  const blockClass = row.type === 'wide' ? styles.wideBlock : (isLargeBlock ? styles.largeBlock : styles.block);
                  return (
                    <div key={`block-${group.id}-${rowIndex}-${blockIndex}`} className={blockClass}>
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
          </React.Fragment>
        ))}
      </div>

{!previewSets && (
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
      )}
    </div>
  );
};

export default ProductsPage;
