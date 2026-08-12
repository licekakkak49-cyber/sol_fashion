import React from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import ProductCard from './ProductCard';
import styles from './CollectionHighlight.module.css';

const CollectionHighlight = () => {
  const { products } = useAdmin();
  const featuredProducts = products.slice(0, 4);
  return (
    <section className={styles.section}>
      <div className={styles.textContainer}>
        <h2 className={styles.title}>SOL Fall 2026</h2>
        <Link to="/products" className={styles.link}>Discover the Collection</Link>
      </div>
      
      <div className={styles.grid}>
        <div className={styles.imageWrapper}>
          <img 
            src="https://www.jacquemus.com/dw/image/v2/BJFJ_PRD/on/demandware.static/-/Sites-master-jacquemus/default/dw040b3344/MAILLOT-TRIANGLE-PRINT-DOTS-NAVY.jpg?sw=881&q=100" 
            alt="Fall 26 Look 1" 
            className={styles.image}
          />
        </div>
        <div className={styles.imageWrapper}>
          <img 
            src="https://www.jacquemus.com/dw/image/v2/BJFJ_PRD/on/demandware.static/-/Sites-master-jacquemus/default/dw68248fca/26ESKW00677AK00322520_30.jpg?sw=881&q=100" 
            alt="Fall 26 Look 2" 
            className={styles.image}
          />
        </div>
      </div>

      <div className={styles.productGrid}>
        {featuredProducts.map((product) => (
          <div key={product.id} className={styles.productCardWrapper}>
            <ProductCard 
              id={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
              tags={product.tags}
              colors={product.colors}
              selectedColor={product.selectedColor}
              extraColorsCount={product.extraColorsCount}
              isLarge={false}
              overlayMode={true}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CollectionHighlight;
