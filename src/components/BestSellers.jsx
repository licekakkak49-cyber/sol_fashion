import React from 'react';
import ProductCard from './ProductCard';
import styles from './BestSellers.module.css';

// Using mock data similar to the products page
const BEST_SELLERS = [
  { id: '1', name: "Zest 01", price: "฿ 9,800.00", image: "https://www.keringeyewear.com/dam/jcr:5bf188d9-23ab-4f6a-b304-94d5b7a40f2c/KeringEyewear_Website_Thumbnails_blok_4251_10%20(1).jpg" },
  { id: '2', name: "Ivy T1", price: "฿ 9,800.00", image: "https://www.keringeyewear.com/dam/jcr:7950e987-62e3-42a2-ad5b-315c0d897664/KeringEyewear_Website_Thumbnails_now_6665_C04_10%20(1).jpg" },
  { id: '3', name: "Macual 02(BRG)", price: "฿ 9,020.00", image: "https://www.keringeyewear.com/dam/jcr:1b521430-17e7-4319-b734-ff8d48428ccd/KeringEyewear_Website_Thumbnails_thintanium_5350_K292_PGT%20(1).jpg" },
  { id: '4', name: "Mori 02", price: "฿ 10,180.00", image: "https://www.keringeyewear.com/dam/jcr:cb990dd9-9732-4075-a5a2-52757c778132/KeringEyewear_Website_Thumbnails_rim_82028_SL112_10%20(1).jpg" },
  { id: '5', name: "Roxy T1", price: "฿ 9,800.00", image: "https://www.keringeyewear.com/dam/jcr:5bf188d9-23ab-4f6a-b304-94d5b7a40f2c/KeringEyewear_Website_Thumbnails_blok_4251_10%20(1).jpg" },
  { id: '6', name: "Jasmin 01(BL)", price: "฿ 9,020.00", image: "https://www.keringeyewear.com/dam/jcr:7950e987-62e3-42a2-ad5b-315c0d897664/KeringEyewear_Website_Thumbnails_now_6665_C04_10%20(1).jpg" }
];

const BestSellers = () => {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>BEST: THIS WEEK TOP 20</h2>
        <a href="/best-sellers" className={styles.moreLink}>MORE</a>
      </div>
      
      <div className={styles.slider}>
        {BEST_SELLERS.map(product => (
          <div key={product.id} className={styles.cardWrapper}>
            <ProductCard 
              {...product} 
              minimal={true} 
              hideBookmark={true} 
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestSellers;
