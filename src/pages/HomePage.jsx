import React from 'react';
import HeroSection from '../components/HeroSection';
import CollectionHighlight from '../components/CollectionHighlight';
import BannerSection from '../components/BannerSection';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <CollectionHighlight />
      <BannerSection 
        imageUrl="https://alemais.com/cdn/shop/files/260702_ALE_15_013_a.jpg?v=1786427393&width=2048"
        altText="Alemais Full Screen Banner"
        objectPosition="top"
      />
    </>
  );
};

export default HomePage;
