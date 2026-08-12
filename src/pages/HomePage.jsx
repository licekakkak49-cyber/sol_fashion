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
        imageUrl="https://eu.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2026/central/collections/women-shoes/WShoes_Novelties_Mules_Sandals_HP_Push_August26_DI3.jpg?wid=4096"
        altText="New Collection Banner"
      />
    </>
  );
};

export default HomePage;
