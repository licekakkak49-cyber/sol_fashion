import React from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import ProductCard from './ProductCard';
import styles from './CollectionHighlight.module.css';

const CollectionHighlight = () => {
  const { products } = useAdmin();
  const featuredProducts = products.slice(3, 7); // Using items 3-6 which are Look 1-4
  return (
    <section className={styles.section}>
      <div className={styles.textContainer}>
        <h2 className={styles.title}>SOL Fall 2026</h2>
        <Link to="/products" className={styles.link}>Discover the Collection</Link>
      </div>
      
      <div className={styles.grid}>
        <div className={styles.imageWrapper}>
          <img 
            src="https://alemais.com/cdn/shop/files/260702_ALE_14_081_b_4c3eb44c-bbd9-4360-a4e7-ec304a0d04bc.jpg?v=1786427419&width=1920" 
            alt="Left Image" 
            className={styles.image}
          />
        </div>
        <div className={styles.imageWrapper}>
          <img 
            src="https://alemais.com/cdn/shop/files/260702_ALE_13_204_c.jpg?v=1786427206&width=1920" 
            alt="Right Image" 
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
              hoverImage={product.hoverImage}
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
