import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import styles from './GlobalFilterPanel.module.css';

const FILTER_DATA = {
  color: [
    'Beige', 'Black', 'Blue', 
    'Brown', 'Gold', 'Green', 
    'Grey', 'Navy', 'Orange', 
    'Pink', 'Red', 'Silver', 
    'White', 'Yellow'
  ],
  size: [
    '23', '24', '25', '26', '27', '28',
    '29', '30', '31', '32', '33', '34',
    '35', '36', '37', '38', '39', '40',
    '41', '42', '44', '50', '52', '54',
    '56', '58', '60', '70', '75', '80',
    '85', '90', '95', '100', '105', 'L',
    'M', 'OS', 'S', 'XL', 'XS', 'XXL',
    'XXS', 'XXXL'
  ],
  category: ['Ready-to-wear', 'Bags', 'Shoes', 'Accessories', 'Jewelry', 'Hats'],
  line: ['Le Chouchou', 'L\'Amour', 'Les Sculptures', 'Le Raphia', 'La Montagne', 'Le Splash']
};

const GlobalFilterPanel = ({ isOpen, selectedFilters, onFilterChange, filteredCount, onClose, removeFilter, onClearAll }) => {
  const [openSection, setOpenSection] = useState('COLOR');

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  const toggleSection = (section) => {
    setOpenSection(prev => prev === section ? null : section);
  };

  const getDotColor = (colorName) => {
    const map = {
      'Beige': '#e8dec9', 'Black': '#000000', 'Blue': '#1c39bb',
      'Brown': '#5c4033', 'Gold': '#d4af37', 'Green': '#228b22',
      'Grey': '#808080', 'Navy': '#000080', 'Orange': '#ffa500',
      'Pink': '#ffc0cb', 'Red': '#ff0000', 'Silver': '#c0c0c0',
      'White': '#ffffff', 'Yellow': '#ffd700'
    };
    return map[colorName] || colorName.toLowerCase();
  };

  const renderColorOptions = (category, data) => (
    <div className={styles.grid3Col}>
      {data.map((item) => {
        const isChecked = selectedFilters[category]?.includes(item) || false;
        return (
          <label key={`${category}-${item}`} className={`${styles.boxLabel} ${isChecked ? styles.boxLabelChecked : ''}`}>
            <input
              type="checkbox"
              className={styles.checkboxInput}
              checked={isChecked}
              onChange={() => onFilterChange(category, item)}
            />
            <span className={styles.colorDot} style={{ backgroundColor: getDotColor(item) }}></span>
            <span className={styles.boxText}>{item}</span>
          </label>
        );
      })}
    </div>
  );

  const renderBoxOptions = (category, data, isSize = false) => (
    <div className={isSize ? styles.grid6Col : styles.grid3Col}>
      {data.map((item) => {
        const isChecked = selectedFilters[category]?.includes(item) || false;
        return (
          <label key={`${category}-${item}`} className={`${styles.boxLabel} ${isSize ? styles.boxLabelSize : ''} ${isChecked ? styles.boxLabelChecked : ''}`}>
            <input
              type="checkbox"
              className={styles.checkboxInput}
              checked={isChecked}
              onChange={() => onFilterChange(category, item)}
            />
            <span className={styles.boxText}>{item}</span>
          </label>
        );
      })}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.sidebarOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.sidebarContainer}
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <div className={styles.innerContent} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span className={styles.headerTitle}>Filters</span>
                <button className={styles.closeBtn} onClick={onClose}>
                  <X size={24} strokeWidth={1} />
                </button>
              </div>
            </div>

            <div className={styles.scrollContent}>
              <div className={styles.innerContent}>
                <div className={styles.topCheckboxes}>
                <label className={styles.optionLabel}>
                  <input type="checkbox" className={styles.checkboxInput} />
                  <span className={styles.customBox}></span>
                  <span className={styles.optionText}>Available</span>
                </label>
                <label className={styles.optionLabel}>
                  <input type="checkbox" className={styles.checkboxInput} disabled />
                  <span className={styles.customBox}></span>
                  <span className={styles.optionText} style={{ color: '#999' }}>Exclusive</span>
                </label>
              </div>

              <div className={styles.accordionGroup}>
                <div className={styles.accordionItem}>
                  <button className={styles.accordionHeader} onClick={() => toggleSection('COLOR')}>
                    <span>COLOR</span>
                    <ChevronDown size={14} strokeWidth={1.5} className={`${styles.chevron} ${openSection === 'COLOR' ? styles.chevronOpen : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openSection === 'COLOR' && (
                      <motion.div 
                        className={styles.accordionContent}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={styles.accordionInner}>
                          {renderColorOptions('color', FILTER_DATA.color)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className={styles.accordionItem}>
                  <button className={styles.accordionHeader} onClick={() => toggleSection('SIZE')}>
                    <span>SIZE</span>
                    <ChevronDown size={14} strokeWidth={1.5} className={`${styles.chevron} ${openSection === 'SIZE' ? styles.chevronOpen : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openSection === 'SIZE' && (
                      <motion.div 
                        className={styles.accordionContent}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={styles.accordionInner}>
                          {renderBoxOptions('size', FILTER_DATA.size, true)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className={styles.accordionItem}>
                  <button className={styles.accordionHeader} onClick={() => toggleSection('CATEGORY')}>
                    <span>CATEGORY</span>
                    <ChevronDown size={14} strokeWidth={1.5} className={`${styles.chevron} ${openSection === 'CATEGORY' ? styles.chevronOpen : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openSection === 'CATEGORY' && (
                      <motion.div 
                        className={styles.accordionContent}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={styles.accordionInner}>
                          {renderBoxOptions('category', FILTER_DATA.category)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className={styles.accordionItem}>
                  <button className={styles.accordionHeader} onClick={() => toggleSection('LINE')}>
                    <span>LINE</span>
                    <ChevronDown size={14} strokeWidth={1.5} className={`${styles.chevron} ${openSection === 'LINE' ? styles.chevronOpen : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openSection === 'LINE' && (
                      <motion.div 
                        className={styles.accordionContent}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={styles.accordionInner}>
                          {renderBoxOptions('line', FILTER_DATA.line)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              </div>
            </div>

            <div className={styles.footer}>
              <div className={styles.innerContent} style={{ display: 'flex', gap: '6px', width: '100%' }}>
                <button className={styles.resetBtn} onClick={onClearAll}>
                RESET
              </button>
              <button className={styles.seeResultBtn} onClick={onClose}>
                SEE RESULT
              </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalFilterPanel;
