import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        <div className={styles.leftColumn}>
          <div className={styles.logo}>
            <img 
              src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/Artboard%202.svg" 
              alt="Moreyes Logo" 
              className={styles.logoImg}
            />
          </div>
          <div className={styles.copyright}>
            <p>&copy; Moreyes 2026. All rights reserved.</p>
            <p>Moreyes S.p.A. Via Optical 100, 10100 Bangkok</p>
            <p>TAX ID: 01234567890</p>
          </div>
        </div>

        <div className={styles.rightHalf}>
          <div className={styles.middleColumn}>
            <div className={styles.sectionHeading}>MOREYES</div>
            
            <div className={styles.subSection}>
              <h4 className={styles.subHeading}>ABOUT</h4>
              <ul className={styles.linkList}>
                <li><a href="#">The premier destination for bespoke vision</a></li>
                <li><a href="#">Our Journey</a></li>
                <li><a href="#">Sustainability</a></li>
                <li><a href="#">Moreyes Through Their Eyes</a></li>
                <li><a href="#">Our Offices</a></li>
              </ul>
            </div>

            <div className={styles.subSection}>
              <h4 className={styles.subHeading}>JOIN US</h4>
              <ul className={styles.linkList}>
                <li><a href="#">Our People</a></li>
              </ul>
            </div>

            <div className={styles.subSection}>
              <a href="#" className={styles.standaloneLink}>NEWSROOM</a>
            </div>

            <div className={styles.subSection}>
              <a href="#" className={styles.standaloneLink}>ABOUT MOREYES</a>
            </div>

            <div className={styles.subSection}>
              <h4 className={styles.subHeading}>PRODUCT COMPLIANCE</h4>
              <ul className={styles.linkList}>
                <li><a href="#">Declarations of Conformity</a></li>
                <li><a href="#">Statement</a></li>
              </ul>
            </div>

            <div className={styles.subSection}>
              <h4 className={styles.subHeading}>LEGAL</h4>
              <ul className={styles.linkList}>
                <li><a href="#">Code of Ethics</a></li>
                <li><a href="#">Vulnerability Disclosure Policy</a></li>
              </ul>
            </div>

            <div className={styles.subSection}>
              <a href="#" className={styles.standaloneLink}>PRIVACY & COOKIE POLICY</a>
            </div>

            <div className={styles.subSection}>
              <a href="#" className={styles.standaloneLink}>CONTACT US</a>
            </div>

            <div className={styles.subSection}>
              <h4 className={styles.subHeading}>BUSINESS AREA</h4>
              <ul className={styles.linkList}>
                <li><a href="#">my.moreyes.com</a></li>
              </ul>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.sectionHeading}>OUR BRANDS</div>
            <ul className={styles.brandList}>
              <li><a href="#">Prada</a></li>
              <li><a href="#">Gucci</a></li>
              <li><a href="#">Oakley</a></li>
              <li><a href="#">Silhouette</a></li>
              <li><a href="#">Moscot</a></li>
              <li><a href="#">Cartier</a></li>
              <li><a href="#">Saint Laurent</a></li>
              <li><a href="#">Bottega Veneta</a></li>
              <li><a href="#">Balenciaga</a></li>
              <li><a href="#">Lindberg</a></li>
              <li><a href="#">Maui Jim</a></li>
              <li><a href="#">Chloé</a></li>
              <li><a href="#">Montblanc</a></li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
