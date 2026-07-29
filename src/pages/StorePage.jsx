import React, { useState, useEffect } from 'react';
import { ChevronDown, Navigation, SlidersHorizontal } from 'lucide-react';
import styles from './StorePage.module.css';

const storeData = [
  {
    id: 1,
    name: "MOREYES FLAGSHIP BANGKOK",
    distance: "0.0km",
    status: "Closed - Reopens at 10:00 am today",
    address: "Siam Paragon, M Floor & Unit 123, 1 Floor\nNo.991 Rama I Road, Pathum Wan, Bangkok 10330 Thailand",
    services: ["Fitting Service", "Simple Repair", "Drop off Repairs"],
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5901306132717!2d100.53235541178652!3d13.743198086603125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ed29007db31%3A0xc623fde1bc6a7a0b!2sSiam%20Paragon!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth"
  },
  {
    id: 2,
    name: "MOREYES CENTRAL EMBASSY",
    distance: "1.2km",
    status: "Open - Closes at 20:00 today",
    address: "Central Embassy, Level 2\n1031 Phloen Chit Rd, Pathum Wan, Bangkok 10330 Thailand",
    services: ["Fitting Service", "Styling Consultation"],
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5898863266155!2d100.54415841178647!3d13.74324708660295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ede097c5e2d%3A0xf6fa925c0cc35678!2sCentral%20Embassy!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth"
  },
  {
    id: 3,
    name: "MOREYES ICONSIAM",
    distance: "4.5km",
    status: "Open - Closes at 21:00 today",
    address: "ICONSIAM, M Floor\n299 Charoen Nakhon Rd, Khlong Ton Sai, Khlong San, Bangkok 10600 Thailand",
    services: ["Fitting Service", "Simple Repair", "Drop off Repairs"],
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.8617830635395!2d100.50831671178553!3d13.726792386621008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e298c47b59e559%3A0x6b866c1b33faeb71!2sICONSIAM!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth"
  },
  {
    id: 4,
    name: "MOREYES EMQUARTIER",
    distance: "5.1km",
    status: "Open - Closes at 20:00 today",
    address: "EmQuartier, M Floor\n695 Sukhumvit Road, Khlong Tan Nuea, Watthana, Bangkok 10110 Thailand",
    services: ["Fitting Service", "Styling Consultation"],
    image: "https://images.unsplash.com/photo-1555529771-835f59fc5efe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.764510705494!2d100.56708681178584!3d13.732786386614457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29f0322ba2571%3A0x4466b0f34e6d4ff1!2sEmQuartier!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth"
  },
  {
    id: 5,
    name: "MOREYES CENTRAL WORLD",
    distance: "2.1km",
    status: "Closed - Reopens at 10:00 am today",
    address: "Central World, 1st Floor\n999/9 Rama I Rd, Pathum Wan, Bangkok 10330 Thailand",
    services: ["Fitting Service", "Drop off Repairs"],
    image: "https://images.unsplash.com/photo-1541890289-b86df5bafd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.525546255716!2d100.53673551178672!3d13.746654886599101!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ecfc1d977e1%3A0x28059e0a0d4b9b4!2sCentralwOrld!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth"
  }
];

const StorePage = () => {
  const [activeStoreId, setActiveStoreId] = useState(storeData[0].id);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const activeStore = storeData.find(store => store.id === activeStoreId);

  return (
    <div className={styles.page}>
      <div className={styles.mapContainer}>
        <iframe
          src={activeStore?.mapUrl}
          className={styles.mapIframe}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Moreyes Store Map"
        ></iframe>
      </div>
      
      <div className={styles.detailsContainer}>
        <div className={styles.controlsHeader}>
          <div className={styles.controlsLeft}>
            <div className={styles.dropdownGroup}>
              <div className={styles.dropdown}>
                <span className={styles.dropdownLabel}>Country/Region</span>
                <div className={styles.dropdownSelect}>
                  <span>Thailand</span>
                  <ChevronDown size={14} />
                </div>
              </div>
              <div className={styles.dropdown}>
                <span className={styles.dropdownLabel}>City</span>
                <div className={styles.dropdownSelect}>
                  <span>Bangkok</span>
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>
            <button className={styles.currentLocationBtn}>
              <Navigation size={12} />
              <span>Use current location</span>
            </button>
          </div>
          
          <button className={styles.filterBtn}>
            <span>Filter</span>
            <SlidersHorizontal size={14} />
          </button>
        </div>

        <div className={styles.storeList}>
          {storeData.map((store) => (
            <div 
              key={store.id} 
              className={`${styles.storeCard} ${store.id === activeStoreId ? styles.storeCardActive : ''}`}
              onClick={() => setActiveStoreId(store.id)}
            >
              <div className={styles.storeHeader}>
                <h2 className={styles.storeName}>{store.name}</h2>
                <span className={styles.storeDistance}>{store.distance}</span>
              </div>
              
              <p className={styles.storeStatus}>{store.status}</p>
              <p className={styles.storeAddress}>
                {store.address.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
              
              <div className={styles.services}>
                {store.services.map((service, idx) => (
                  <span key={idx} className={styles.servicePill}>{service}</span>
                ))}
              </div>
              
              <img 
                src={store.image} 
                alt={store.name} 
                className={styles.storeImage} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorePage;
