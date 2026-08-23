import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import styles from './CollectionHighlight.module.css';
import { useAdmin } from '../context/AdminContext';

const CollectionHighlight = ({ data }) => {
  const { products } = useAdmin();

  const title = data?.title || "SOL Fall 2026";
  const linkText = data?.linkText || "Discover the Collection";
  const linkUrl = data?.linkUrl || "/products";
  const leftImage = data?.leftImage || "https://alemais.com/cdn/shop/files/260702_ALE_14_081_b_4c3eb44c-bbd9-4360-a4e7-ec304a0d04bc.jpg?v=1786427419&width=1920";
  const rightImage = data?.rightImage || "https://alemais.com/cdn/shop/files/260702_ALE_13_204_c.jpg?v=1786427206&width=1920";

  let featuredProductsData = [];
  
  if (data && data.featuredProducts && products.length > 0) {
    featuredProductsData = data.featuredProducts
      .map(id => products.find(p => p.id === id))
      .filter(Boolean);
  } else {
    // Fallback hardcoded if no data passed
    featuredProductsData = [
      {"id": "4", "name": "Everyday Crossbody", "price": 7463, "image": "https://alemais.com/cdn/shop/files/8230A-1_6000x.jpg?v=1783657629"},
      {"id": "5", "name": "Woven Beach Tote", "price": 7742, "image": "https://alemais.com/cdn/shop/files/alemais-sustainable-jacket-spur-denim-jacket-1253883487_6000x.jpg?v=1786475956"},
      {"id": "6", "name": "Quilted Mini Bag", "price": 8078, "image": "https://alemais.com/cdn/shop/files/8076D_c7fc4759-d747-4c18-bf25-389f7b0219b0_6000x.jpg?v=1786332923"},
      {"id": "7", "name": "Slouchy Shoulder Bag", "price": 1935, "image": "https://alemais.com/cdn/shop/files/8116S_2b259435-913b-40d0-820f-da3729472494_6000x.jpg?v=1786333610"}
    ];
  }

  return (
    <section className={styles.section}>
      <div className={styles.textContainer}>
        <h2 className={styles.title}>{title}</h2>
        <Link to={linkUrl} className={styles.link}>{linkText}</Link>
      </div>
      
      <div className={styles.grid}>
        <div className={styles.imageWrapper}>
          <img 
            src={leftImage} 
            alt="Left Image" 
            className={styles.image}
          />
        </div>
        <div className={styles.imageWrapper}>
          <img 
            src={rightImage} 
            alt="Right Image" 
            className={styles.image}
          />
        </div>
      </div>

      <div className={styles.productGrid}>
        {featuredProductsData.map((product, idx) => (
          <div key={product.id || idx} className={styles.productCardWrapper}>
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
