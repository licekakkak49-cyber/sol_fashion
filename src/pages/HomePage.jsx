import React from 'react';
import HeroSection from '../components/HeroSection';
import BrandStory from '../components/BrandStory';
import BestSellers from '../components/BestSellers';
import ExperienceGrid from '../components/ExperienceGrid';
import FeaturedGrid from '../components/FeaturedGrid';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <BrandStory />
      <BestSellers />
      <ExperienceGrid />
      <FeaturedGrid />
    </>
  );
};

export default HomePage;
