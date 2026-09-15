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
      // 0. Status check (exclude drafts)
      const pStatus = (product.status || 'draft').toLowerCase();
      if (!previewSets && pStatus === 'draft') return false;

      // 1. Navigation & Category Pill Filtering
      if (mainParam === 'New In' || activeCategory === 'New In') {
        const hasNew = product.tags && (product.tags.includes('new') || product.tags.includes('New In'));
        if (!hasNew) return false;
      } else if (mainParam && mainParam !== 'Explore') {
        if (product.mainCategory !== mainParam) return false;
      }
      
      if (activeCategory && activeCategory !== 'View all' && activeCategory !== 'New In') {
        if (product.subCategory !== activeCategory) return false;
      }
      
      // 2. Sidebar Filters
      for (const [category, values] of Object.entries(selectedFilters)) {
        if (values.length > 0) {
          if (category === 'size') {
            const hasSize = (product.colorVariants || []).some(v => 
              v.stock && Object.entries(v.stock).some(([sz, qty]) => values.includes(sz) && parseInt(qty) > 0)
            );
            if (!hasSize) return false;
          } else if (category === 'color') {
            const hasColor = (product.colorVariants || []).some(v => {
              if (!values.includes(v.name)) return false;
              return v.stock && Object.values(v.stock).some(qty => parseInt(qty) > 0);
            });
            if (!hasColor) return false;
          } else if (category === 'category') {
            if (!values.includes(product.mainCategory) && !values.includes(product.subCategory)) return false;
          } else if (category === 'line') {
            const hasLine = (product.tags || []).some(t => values.includes(t));
            if (!hasLine) return false;
          } else {
            // fallback
            if (!values.includes(product[category])) return false;
          }
        }
      }
      return true;
    });
  }, [selectedFilters, products, mainParam, activeCategory]);

  const displayGroups = useMemo(() => {
    const buildRows = (items) => {
      const rows = [];
      let i = 0;
      
      while (i < items.length) {
        const getLayoutSize = (item) => item.layoutSize || (item.isLarge ? 'large' : 'small');
        
        // Pattern 1: 4 smalls + 1 large (Large on right)
        if (
          i + 4 < items.length &&
          getLayoutSize(items[i]) === 'small' &&
          getLayoutSize(items[i+1]) === 'small' &&
          (
            (getLayoutSize(items[i+2]) === 'small' && getLayoutSize(items[i+3]) === 'small' && getLayoutSize(items[i+4]) === 'large') ||
            (getLayoutSize(items[i+2]) === 'large' && getLayoutSize(items[i+3]) === 'small' && getLayoutSize(items[i+4]) === 'small')
          )
        ) {
          const smalls = [items[i], items[i+1], items[i+2], items[i+3], items[i+4]].filter(item => getLayoutSize(item) === 'small');
          const large = [items[i], items[i+1], items[i+2], items[i+3], items[i+4]].find(item => getLayoutSize(item) === 'large');
          
          rows.push({
            type: 'standard',
            blocks: [
              { type: 'standard', items: smalls },
              { type: 'standard', items: [large] }
            ]
          });
          i += 5;
        }
        // Pattern 2: 1 large + 4 smalls (Large on left)
        else if (
          i + 4 < items.length &&
          getLayoutSize(items[i]) === 'large' &&
          getLayoutSize(items[i+1]) === 'small' &&
          getLayoutSize(items[i+2]) === 'small' &&
          getLayoutSize(items[i+3]) === 'small' &&
          getLayoutSize(items[i+4]) === 'small'
        ) {
          rows.push({
            type: 'standard',
            blocks: [
              { type: 'standard', items: [items[i]] },
              { type: 'standard', items: [items[i+1], items[i+2], items[i+3], items[i+4]] }
            ]
          });
          i += 5;
        }
        // Pattern 3: 4 smalls (Row)
        else if (
          i + 3 < items.length &&
          getLayoutSize(items[i]) === 'small' &&
          getLayoutSize(items[i+1]) === 'small' &&
          getLayoutSize(items[i+2]) === 'small' &&
          getLayoutSize(items[i+3]) === 'small'
        ) {
          rows.push({
            type: 'standard',
            blocks: [
              { type: 'standard', items: [items[i], items[i+1], items[i+2], items[i+3]] }
            ]
          });
          i += 4;
        }
        // Wide support
        else if (getLayoutSize(items[i]) === 'wide') {
          rows.push({
            type: 'wide',
            blocks: [{ type: 'wide', items: [items[i]] }]
          });
          i++;
        }
        // Fallback: Pack remaining items greedily (like old algorithm but strictly enforcing capacity)
        else {
          const blocks = [];
          let currentBlock = [];
          let currentCapacity = 4;
          
          while (i < items.length && blocks.length < 2) {
            const size = getLayoutSize(items[i]);
            if (size === 'wide') break; // break out to handle wide in next iteration
            
            const req = size === 'large' ? 4 : 1;
            
            if (req > currentCapacity && currentBlock.length > 0) {
              blocks.push({ type: 'standard', items: currentBlock });
              currentBlock = [];
              currentCapacity = 4;
              if (blocks.length === 2) break; // Row is full
            }
            
            if (req === 4) { // large item takes whole block
              if (currentBlock.length > 0) {
                blocks.push({ type: 'standard', items: currentBlock });
                currentBlock = [];
                currentCapacity = 4;
              }
              if (blocks.length < 2) {
                blocks.push({ type: 'standard', items: [items[i]] });
                i++;
              }
              if (blocks.length === 2) break;
              continue;
            } else {
              currentBlock.push(items[i]);
              currentCapacity -= req;
              i++;
              
              if (currentCapacity === 0) {
                blocks.push({ type: 'standard', items: currentBlock });
                currentBlock = [];
                currentCapacity = 4;
              }
            }
          }
          
          if (currentBlock.length > 0 && blocks.length < 2) {
            blocks.push({ type: 'standard', items: currentBlock });
          }
          
          if (blocks.length > 0) {
            rows.push({ type: 'standard', blocks });
          }
        }
      }
      return rows;
    };

    const now = new Date();
    const activeSets = (sets || []).filter(s => {
       // 1. Navigation & Category Pill Filtering
       if (!previewSets) {
         if (mainParam === 'New In' || activeCategory === 'New In') {
            const hasNewProd = (s.items || []).some(setItem => {
               const p = (products || []).find(prod => prod.id === setItem.productId);
               return p && p.tags && (p.tags.includes('new') || p.tags.includes('New In'));
            });
            if (!hasNewProd) return false;
         } else if (mainParam && mainParam !== 'Explore') {
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

    // Ensure sets are ordered strictly by display order (created_at DESC / Set #1 on top)
    activeSets.sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0));

    const groups = [];
    const assignedProductIds = new Set();
    let displayProductCount = 0;

    // 1. Collect all product IDs in active sets on this page upfront
    activeSets.forEach(set => {
      (set.items || []).forEach(item => {
        if (item.productId && !String(item.productId).startsWith('draft-')) {
          assignedProductIds.add(String(item.productId));
        }
      });
    });

    // 2. Build Lookbook Set groups
    activeSets.forEach(set => {
       const setItems = (set.items || []).map((setItem, idx) => {
          const product = (products || []).find(p => String(p.id) === String(setItem.productId));
          if (product) {
             return { 
               ...product, 
               uniqueKey: `${product.id}-${set.id}-${idx}`,
               realProductId: product.id,
               image: setItem.customCover || product.image || product.coverImage,
               layoutSize: setItem.layoutSize 
             };
          }
          return null;
       }).filter(Boolean);

       if (setItems.length > 0) {
          groups.push({
            type: 'set',
            id: set.id,
            rows: buildRows(setItems)
          });
          displayProductCount += setItems.length;
       }
    });

    // 3. Display remaining published category products that are NOT in any active Look Set on this page
    const unassignedItems = [];
    for (let product of filteredProducts) {
       if (!assignedProductIds.has(String(product.id))) {
          if (displayProductCount < visibleCount) {
             unassignedItems.push(product);
             displayProductCount++;
          }
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
    if (!products) return 0;
    
    return products.filter(p => {
       // Must not be draft
       if (!previewSets && (p.status || 'draft').toLowerCase() === 'draft') return false;
       
       if (cat === 'View all') {
          if (mainParam && mainParam !== 'Explore' && mainParam !== 'New In') {
             return p.mainCategory === mainParam;
          }
          if (mainParam === 'New In') {
             return p.tags && (p.tags.includes('new') || p.tags.includes('New In'));
          }
          return true;
       }
       
       if (cat === 'New In') {
          return p.tags && (p.tags.includes('new') || p.tags.includes('New In'));
       }
       
       if (mainParam && mainParam !== 'Explore' && mainParam !== 'New In') {
          if (p.mainCategory !== mainParam) return false;
       }
       
       return p.subCategory === cat || p.mainCategory === cat;
    }).length;
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
          products={products}
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
                          key={product.uniqueKey || product.id} 
                          className={layoutSize === 'large' ? styles.largeCard : styles.standardCard}
                        >
                          <ProductCard 
                            id={product.realProductId || product.id}
                            image={product.image}
                            hoverImage={product.hoverImage}
                            name={product.name}
                            price={product.price}
                            tags={product.tags}
                            colors={product.colors}
                            colorVariants={product.colorVariants}
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

      {!previewSets && visibleCount < filteredProducts.length && (
        <div className={styles.bottomSection}>
          <div className={styles.loadMoreContainer}>
            <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
              VIEW MORE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
