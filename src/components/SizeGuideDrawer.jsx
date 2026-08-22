import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import styles from './SizeGuideDrawer.module.css';

const SizeGuideDrawer = ({ isOpen, onClose }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeTab, setActiveTab] = useState('rtw');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const tabs = [
    { id: 'rtw', label: 'Ready to Wear' },
    { id: 'shoes', label: 'Shoes' },
    { id: 'body', label: 'Body Measurements' }
  ];

  const rtwData = {
    brands: ['XXS/32', 'XS/34', 'S/36', 'M/38', 'L/40', 'XL/42', 'XXL/44', 'XXXL/46'],
    denim: ['23', '24-25', '26-27', '28-29', '30-31', '32-33', '34-35', '36-37'],
    uk: ['4', '6', '8', '10', '12', '14', '16', '18'],
    us: ['0', '2', '4', '6', '8', '10', '12', '14'],
    france: ['32', '34', '36', '38', '40', '42', '44', '46'],
    italy: ['36', '38', '40', '42', '44', '46', '48', '50'],
    japan: ['1', '3', '5', '7', '9', '11', '13', '15'],
    korea: ['33', '44', '55', '66', '77', '88', '99', '110']
  };

  const shoeData = {
    eu: ['35', '36', '37', '38', '39', '40', '41'],
    uk: ['2', '3', '4', '5', '6', '7', '8'],
    us: ['4', '5', '6', '7', '8', '9', '10'],
    japan: ['22', '23', '24', '25', '26', '27', '28'],
    china: ['35', '36', '37', '38', '39', '40', '41']
  };

  const bodyData = {
    size: ['32', '34', '36', '38', '40', '42', '44', '46'],
    chest: ['78', '82', '86', '90', '94', '99', '104', '109'],
    waist: ['58', '62', '66', '70', '74', '79', '84', '89'],
    pelvis: ['86', '90', '94', '98', '102', '107', '112', '117']
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.sidebarOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className={styles.sidebarContainer}
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className={styles.innerContainer}>
              <div className={styles.header}>
              <h2 className={styles.title}>Size guide</h2>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close Guide">
                <X size={24} strokeWidth={1} />
              </button>
            </div>

            <div className={styles.tabs}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={styles.content}>
              {activeTab === 'rtw' && (
                <div className={styles.tableWrapper}>
                  <table className={styles.sizeTable}>
                    <thead>
                      <tr>
                        <th>SOL</th>
                        {rtwData.brands.map((val, idx) => <th key={idx}>{val}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Denim size</td>{rtwData.denim.map((val, idx) => <td key={idx}>{val}</td>)}</tr>
                      <tr><td>UK</td>{rtwData.uk.map((val, idx) => <td key={idx}>{val}</td>)}</tr>
                      <tr><td>US</td>{rtwData.us.map((val, idx) => <td key={idx}>{val}</td>)}</tr>
                      <tr><td>France</td>{rtwData.france.map((val, idx) => <td key={idx}>{val}</td>)}</tr>
                      <tr><td>Italy</td>{rtwData.italy.map((val, idx) => <td key={idx}>{val}</td>)}</tr>
                      <tr><td>Japan</td>{rtwData.japan.map((val, idx) => <td key={idx}>{val}</td>)}</tr>
                      <tr><td>Korea</td>{rtwData.korea.map((val, idx) => <td key={idx}>{val}</td>)}</tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'shoes' && (
                <div className={styles.tableWrapper}>
                  <table className={styles.sizeTable}>
                    <thead>
                      <tr>
                        <th>EU</th>
                        {shoeData.eu.map((val, idx) => <th key={idx}>{val}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>UK</td>{shoeData.uk.map((val, idx) => <td key={idx}>{val}</td>)}</tr>
                      <tr><td>US</td>{shoeData.us.map((val, idx) => <td key={idx}>{val}</td>)}</tr>
                      <tr><td>Japan</td>{shoeData.japan.map((val, idx) => <td key={idx}>{val}</td>)}</tr>
                      <tr><td>China</td>{shoeData.china.map((val, idx) => <td key={idx}>{val}</td>)}</tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'body' && (
                <div className={styles.tableWrapper}>
                  <div style={{ fontSize: '14px', color: '#666', lineHeight: 1.6, fontFamily: '"Futura PT", sans-serif' }}>
                    <p style={{ marginTop: '16px', marginBottom: '32px' }}>In order to select the correct clothing size, we recommend you take the following measurements using a soft tape measure. If necessary, ask someone else to help.</p>
                    
                    <p style={{ marginBottom: '12px' }}>1. Bust</p>
                    <p style={{ marginBottom: '24px' }}>Wearing a bra, pass the tape measure straight across your back, under your arms and over the fullest point of your bust.</p>
                    
                    <p style={{ marginBottom: '12px' }}>2. Waist</p>
                    <p style={{ marginBottom: '24px' }}>Pass the tape measure around your natural waistline, at the narrowest point of your waist. The tape measure should sit snugly against your body, but should not be pulled too tight.</p>
                    
                    <p style={{ marginBottom: '12px' }}>3. Hips</p>
                    <p>Pass the tape measure across your hipbone, around the fullest point of your hips.</p>
                  </div>
                  
                  <div style={{ marginTop: '40px' }}>
                    <table className={styles.sizeTable}>
                      <thead>
                        <tr>
                          <th>Size</th>
                          {bodyData.size.map((val, idx) => <th key={idx}>{val}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td>Chest size</td>{bodyData.chest.map((val, idx) => <td key={idx}>{val}</td>)}</tr>
                        <tr><td>Waist size</td>{bodyData.waist.map((val, idx) => <td key={idx}>{val}</td>)}</tr>
                        <tr><td>Pelvis size</td>{bodyData.pelvis.map((val, idx) => <td key={idx}>{val}</td>)}</tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <p className={styles.footerNote}>
                Please note that measurements and fit may vary slightly depending on the specific design and cut of each item.
              </p>
            </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SizeGuideDrawer;
