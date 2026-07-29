import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import styles from './AccountPage.module.css';

const AccountPage = () => {
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <button className={styles.logoutBtn} onClick={handleLogout}>LOG OUT</button>
      </header>

      <main className={styles.mainContent}>
        <h1 className={styles.greeting}>HELLO, USER</h1>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>WISHLIST{wishlistItems.length > 0 && <sup>{wishlistItems.length}</sup>}</h2>
            <button className={styles.moreBtn}>MORE</button>
          </div>
          <div className={styles.wishlistGrid}>
            {wishlistItems.slice(0, 5).map(item => (
              <div key={item.id} className={styles.wishlistItem}>
                <img src={item.image} alt={item.name} />
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.name}</p>
                  <p className={styles.itemPrice}>{item.price}</p>
                </div>
              </div>
            ))}
            {wishlistItems.length === 0 && (
              <p className={styles.emptyMessage}>You have no items in your wishlist.</p>
            )}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>PROFILE</h2>
            <button className={styles.moreBtn}>MORE</button>
          </div>
          <div className={styles.profileInfo}>
            <p className={styles.name}>New User</p>
            <p className={styles.email}>user@example.com</p>
            <button className={styles.editBtn}>EDIT PROFILE</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AccountPage;
