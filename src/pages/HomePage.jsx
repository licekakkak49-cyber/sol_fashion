import React from 'react';
import HeroSection from '../components/HeroSection';
import BrandStory from '../components/BrandStory';
import ExperienceGrid from '../components/ExperienceGrid';
import FeaturedGrid from '../components/FeaturedGrid';
import StoreSection from '../components/StoreSection';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <BrandStory />
      <FeaturedGrid />
      <ExperienceGrid />
      <StoreSection />
    </>
  );
};

export default HomePage;
