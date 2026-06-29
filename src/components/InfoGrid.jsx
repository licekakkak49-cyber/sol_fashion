import React from 'react';
import styles from './InfoGrid.module.css';

const InfoGrid = () => {
  const items = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1584883445585-2e67df1076b1?q=80&w=800&auto=format&fit=crop",
      title: "THE DOCTOR'S TOUCH",
      description: "Discover our bespoke vision measurement for your unique lifestyle."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1550505118-2e5f33f67eb7?q=80&w=800&auto=format&fit=crop",
      title: "PREMIUM LENSES",
      description: "Learn more about world-class lens technologies from Nikon, Essilor, and Hoya."
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?q=80&w=800&auto=format&fit=crop",
      title: "REAL LIFE LOOKBOOK",
      description: "Read our case reviews and see how we solve complex vision problems."
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=800&auto=format&fit=crop",
      title: "FIND YOUR MATCH",
      description: "Take our quick quiz to find the perfect frame and lens combination."
    }
  ];

  return (
    <section className={styles.container}>
      <div className={styles.grid}>
        {items.map((item) => (
          <div key={item.id} className={styles.column}>
            <div className={styles.imageWrapper}>
              <img src={item.image} alt={item.title} className={styles.image} />
            </div>
            <div className={styles.textContent}>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InfoGrid;
