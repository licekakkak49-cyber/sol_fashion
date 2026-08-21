import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import GlobalFilterPanel from './GlobalFilterPanel';
import { useAdmin } from '../context/AdminContext';
import styles from './SearchDrawer.module.css';

const SearchDrawer = ({ isOpen, onClose }) => {
  const { products } = useAdmin();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const scrollRef = useRef(null);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [selectedSearchCategory, setSelectedSearchCategory] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Newest');
  const [selectedFilters, setSelectedFilters] = useState({
    color: [],
    size: [],
    category: [],
    line: []
  });
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Reset query and selected category when drawer closes or query changes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setQuery('');
        setSelectedSearchCategory(null);
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedSearchCategory(null);
  }, [query]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(handleScroll, 100);
    }
  }, [isOpen]);

  const scrollRight = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const mostViewedProducts = (products || []).slice(0, 4); // Take first 4 products

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return (products || []).filter(p => {
      const matchName = p.name?.toLowerCase().includes(q);
      const matchTag = p.tags?.some(tag => tag.toLowerCase().includes(q));
      const matchCategory = p.category?.toLowerCase().includes(q);
      return matchName || matchTag || matchCategory;
    });
  }, [query, products]);

  const matchingCategories = useMemo(() => {
    if (!searchResults.length) return [];
    const cats = new Set();
    searchResults.forEach(p => {
      if (p.category) cats.add(p.category);
      p.tags?.forEach(tag => cats.add(tag));
    });
    return Array.from(cats);
  }, [searchResults]);

  const finalResults = useMemo(() => {
    if (!selectedSearchCategory) return searchResults;
    return searchResults.filter(p => p.name === selectedSearchCategory);
  }, [searchResults, selectedSearchCategory]);



  const filteredSearchProducts = useMemo(() => {
    let result = finalResults;
    for (const [category, values] of Object.entries(selectedFilters)) {
      if (values.length > 0) {
        result = result.filter(product => values.includes(product[category]));
      }
    }
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, '')));
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, '')));
    }
    return result;
  }, [finalResults, selectedFilters, sortBy]);

  const handleFilterChange = (category, value) => {
    setSelectedFilters(prev => {
      const current = prev[category] || [];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
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
  };

  const handleSuggestionClick = (suggestion) => {
    onClose();
    navigate('/products');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={isMobile ? styles.drawerOverlayMobile : styles.drawerOverlayDesktop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={isMobile ? styles.drawerContentMobile : styles.drawerContentDesktop}
            initial={isMobile ? { y: '100%' } : { y: '-100%' }}
            animate={{ y: 0 }}
            exit={isMobile ? { y: '100%' } : { y: '-100%' }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {isMobile && (
              <div className={styles.header}>
                <span className={styles.headerTitle}>Search</span>
                <button className={styles.closeButton} onClick={onClose}>
                  <X size={20} strokeWidth={1} />
                </button>
              </div>
            )}

            {!isMobile ? (
              <div className={styles.desktopContainer}>
                <div className={styles.desktopSearchHeader}>
                  <div className={styles.searchContainer}>
                    <div className={styles.inputWrapper}>
                      <input 
                        type="text" 
                        placeholder="Search here" 
                        className={styles.searchInput}
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      {query.trim() && (
                        <button className={styles.removeBtn} onClick={() => setQuery('')}>
                          Remove
                        </button>
                      )}
                    </div>
                    <div 
                      className={styles.resultCountText} 
                      style={{ visibility: query.trim() ? 'visible' : 'hidden' }}
                    >
                      {query.trim() ? `${filteredSearchProducts.length} result(s)` : '0 result(s)'}
                    </div>
                  </div>
                  <button className={styles.desktopCloseButton} onClick={onClose}>
                    <X size={20} strokeWidth={1} />
                  </button>
                </div>

                {!query.trim() ? (
                  <div className={styles.desktopBeforeSearch}>
                    <div className={styles.desktopLeft}>
                      <div className={styles.desktopSuggestions}>
                        <h3 className={styles.sectionTitleLight}>Suggestions</h3>
                        <div className={styles.desktopSuggestionsCols}>
                          <ul className={styles.suggestionsList}>
                            <li onClick={() => handleSuggestionClick('New In')}>New In</li>
                            <li onClick={() => handleSuggestionClick('The Valéries')}>The Valéries</li>
                            <li onClick={() => handleSuggestionClick('The Bambinos')}>The Bambinos</li>
                          </ul>
                          <ul className={styles.suggestionsList}>
                            <li onClick={() => handleSuggestionClick('Bags')}>Bags</li>
                            <li onClick={() => handleSuggestionClick('Hats')}>Hats</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className={styles.desktopRight}>
                      <div className={styles.desktopProductsGrid}>
                        {products?.slice(0, 6).map(product => (
                          <div key={product.id} className={styles.desktopProductThumb} onClick={onClose}>
                            <img src={product.image} alt={product.name} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.desktopAfterSearch}>
                    {!selectedSearchCategory ? (
                    <div className={styles.relatedTagsScroll}>
                      <span 
                        className={!selectedSearchCategory ? styles.relatedTagActive : styles.relatedTag} 
                        style={{ textTransform: 'capitalize' }}
                        onClick={() => setSelectedSearchCategory(null)}
                      >
                        {query}
                      </span>
                      {searchResults.slice(0, 4).map((p, idx) => (
                        <span 
                          key={idx} 
                          className={selectedSearchCategory === p.name ? styles.relatedTagActive : styles.relatedTag} 
                          onClick={() => setSelectedSearchCategory(p.name)} 
                          style={{ textTransform: 'capitalize' }}
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                    ) : (
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
                    )}

                    <div className={styles.section}>
                      {filteredSearchProducts.length > 0 ? (
                        <div className={styles.searchResultsGrid}>
                          {filteredSearchProducts.slice(0, 12).map(product => (
                            <div key={product.id} className={styles.productCard} onClick={onClose}>
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
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: '#999', fontSize: '14px' }}>No products found for "{query}"{selectedSearchCategory ? ` in ${selectedSearchCategory}` : ''}.</p>
                      )}
                    </div>

                    {filteredSearchProducts.length > 0 && (
                      <div className={styles.seeResultsBtnWrapper}>
                        <button className={styles.seeResultsBtn} onClick={() => { onClose(); navigate('/products'); }}>
                          SEE THE RESULTS ({filteredSearchProducts.length})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.mobileContainer}>
                <div className={styles.searchContainer}>
                  <div className={styles.inputWrapper}>
                    <input 
                      type="text" 
                      placeholder="Search here" 
                      className={styles.searchInput}
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    {query.trim() && (
                      <button className={styles.removeBtn} onClick={() => setQuery('')}>
                        Remove
                      </button>
                    )}
                  </div>
                  <div 
                    className={styles.resultCountText} 
                    style={{ visibility: query.trim() ? 'visible' : 'hidden' }}
                  >
                    {query.trim() ? `${filteredSearchProducts.length} result(s)` : '0 result(s)'}
                  </div>
                </div>

                {!query.trim() ? (
                  <>
                    <div className={styles.section}>
                      <h3 className={styles.sectionTitleLight}>Suggestions</h3>
                      <ul className={styles.suggestionsList}>
                        <li onClick={() => handleSuggestionClick('New In')}>New In</li>
                        <li onClick={() => handleSuggestionClick('Bags')}>Bags</li>
                        <li onClick={() => handleSuggestionClick('The Valéries')}>The Valéries</li>
                        <li onClick={() => handleSuggestionClick('Hats')}>Hats</li>
                      </ul>
                    </div>

                    <div className={styles.section}>
                      <h3 className={styles.sectionTitle}>Most viewed items</h3>
                      <div className={styles.scrollContainerWrapper}>
                        <div className={styles.productsScroll} ref={scrollRef} onScroll={handleScroll}>
                          {mostViewedProducts.map(product => (
                            <div key={product.id} className={styles.productCard} onClick={onClose}>
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
                              />
                            </div>
                          ))}
                        </div>
                        <button 
                          className={`${styles.scrollNavBtn} ${styles.scrollNavRight} ${isAtEnd ? styles.hiddenBtn : ''}`}
                          onClick={scrollRight}
                        >
                          <ChevronRight size={20} strokeWidth={1.5} color="rgb(30,30,30)" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {!selectedSearchCategory ? (
                    <div className={styles.relatedTagsScroll}>
                      <span 
                        className={!selectedSearchCategory ? styles.relatedTagActive : styles.relatedTag} 
                        style={{ textTransform: 'capitalize' }}
                        onClick={() => setSelectedSearchCategory(null)}
                      >
                        {query}
                      </span>
                      {searchResults.slice(0, 4).map((p, idx) => (
                        <span 
                          key={idx} 
                          className={selectedSearchCategory === p.name ? styles.relatedTagActive : styles.relatedTag} 
                          onClick={() => setSelectedSearchCategory(p.name)} 
                          style={{ textTransform: 'capitalize' }}
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                    ) : (
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
                    )}

                    <div className={styles.section}>
                      {filteredSearchProducts.length > 0 ? (
                        <div className={styles.searchResultsGrid}>
                          {filteredSearchProducts.slice(0, 4).map(product => (
                            <div key={product.id} className={styles.productCard} onClick={onClose}>
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
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: '#999', fontSize: '14px' }}>No products found for "{query}"{selectedSearchCategory ? ` in ${selectedSearchCategory}` : ''}.</p>
                      )}
                    </div>

                    {filteredSearchProducts.length > 0 && (
                      <div className={styles.seeResultsBtnWrapper}>
                        <button className={styles.seeResultsBtn} onClick={() => { onClose(); navigate('/products'); }}>
                          SEE THE RESULTS ({filteredSearchProducts.length})
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
            <GlobalFilterPanel 
          isOpen={isFilterOpen}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filteredCount={filteredSearchProducts.length}
          onClose={() => setIsFilterOpen(false)}
          removeFilter={removeFilter}
          onClearAll={clearAllFilters}
        />
    </AnimatePresence>
  );
};

export default SearchDrawer;
