import React from 'react';
import { X } from 'lucide-react';
import styles from './GlobalFilterPanel.module.css';

const FILTER_DATA = {
  frameColor: ['Black', 'Silver', 'Brown', 'Clear', 'White', 'Gold', 'Gray', 'Green', 'Pink', 'Tortoise', 'Ivory', 'Yellow', 'Orange', 'Red', 'Blue'],
  lensColor: ['Black', 'Gray', 'Brown', 'Green', 'Blue', 'Orange', 'Clear', 'Purple', 'Red', 'Pink', 'Yellow', 'Silver', 'White', 'Gold', 'Ivory'],
  material: ['Acetate', 'Nylon', 'Metal', 'Mixed'],
  shape: ['Square', 'Oval', 'Round', 'Cat-eye', 'Wraparound', 'Aviator']
};

const SORT_OPTIONS = ['Newest', 'Lowest Price', 'Highest Price'];

const GlobalFilterPanel = ({ isOpen, selectedFilters, onFilterChange, sortBy, onSortChange, filteredCount, onClose, removeFilter }) => {
  const getPillText = (category, val) => {
    if (category === 'lensColor') return `${val.toUpperCase()} LENSES`;
    if (category === 'frameColor') return `${val.toUpperCase()} FRAMES`;
    return val.toUpperCase();
  };

  return (
    <div className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}>
      <div className={styles.panelHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.filterTitle}>
            FILTER<sup>{filteredCount}</sup>
          </div>
          <div className={styles.tagContainer}>
            {Object.entries(selectedFilters).flatMap(([category, values]) =>
              values.map(val => (
                <button 
                  key={`tag-${category}-${val}`} 
                  className={styles.filterTag} 
                  onClick={() => removeFilter(category, val)}
                >
                  {getPillText(category, val)} <X size={10} strokeWidth={2} />
                </button>
              ))
            )}
          </div>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={24} strokeWidth={1} />
        </button>
      </div>

      <div className={styles.content}>
        
        {/* Frame Color */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>FRAME COLOR</h3>
          <div className={`${styles.optionsGrid} ${styles.optionsGridDynamic}`}>
            {FILTER_DATA.frameColor.map((color) => (
              <label key={`frame-${color}`} className={styles.optionLabel}>
                <input
                  type="checkbox"
                  checked={selectedFilters.frameColor?.includes(color) || false}
                  onChange={() => onFilterChange('frameColor', color)}
                />
                <span className={styles.customBox}></span>
                {color}
              </label>
            ))}
          </div>
        </div>

        {/* Lens Color */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>LENS COLOR</h3>
          <div className={`${styles.optionsGrid} ${styles.optionsGridDynamic}`}>
            {FILTER_DATA.lensColor.map((color) => (
              <label key={`lens-${color}`} className={styles.optionLabel}>
                <input
                  type="checkbox"
                  checked={selectedFilters.lensColor?.includes(color) || false}
                  onChange={() => onFilterChange('lensColor', color)}
                />
                <span className={styles.customBox}></span>
                {color}
              </label>
            ))}
          </div>
        </div>

        {/* Material */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>MATERIAL</h3>
          <div className={styles.optionsGrid}>
            {FILTER_DATA.material.map((mat) => (
              <label key={`mat-${mat}`} className={styles.optionLabel}>
                <input
                  type="checkbox"
                  checked={selectedFilters.material?.includes(mat) || false}
                  onChange={() => onFilterChange('material', mat)}
                />
                <span className={styles.customBox}></span>
                {mat}
              </label>
            ))}
          </div>
        </div>

        {/* Shape */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>SHAPE</h3>
          <div className={styles.optionsGrid}>
            {FILTER_DATA.shape.map((shp) => (
              <label key={`shape-${shp}`} className={styles.optionLabel}>
                <input
                  type="checkbox"
                  checked={selectedFilters.shape?.includes(shp) || false}
                  onChange={() => onFilterChange('shape', shp)}
                />
                <span className={styles.customBox}></span>
                {shp}
              </label>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>SORT BY</h3>
          <div className={`${styles.optionsGrid} ${styles.optionsGridOneCol}`}>
            {SORT_OPTIONS.map((sortOption) => (
              <label key={`sort-${sortOption}`} className={styles.optionLabel}>
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === sortOption}
                  onChange={() => onSortChange(sortOption)}
                />
                <span className={styles.customBox}></span>
                {sortOption}
              </label>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GlobalFilterPanel;
