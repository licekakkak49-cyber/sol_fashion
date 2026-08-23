import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import styles from './HomePage.module.css';

import HeroBlock from '../components/HomepageBlocks/HeroBlock';
import BannerBlock from '../components/HomepageBlocks/BannerBlock';
import ImageBlock from '../components/HomepageBlocks/ImageBlock';
import ProductBlock from '../components/HomepageBlocks/ProductBlock';
import TextBlock from '../components/HomepageBlocks/TextBlock';
import SpacerBlock from '../components/HomepageBlocks/SpacerBlock';
import CollectionHighlight from '../components/CollectionHighlight';

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('homepage_grid_items')
        .select('*')
        .order('grid_index', { ascending: true });
        
      if (data) {
        setItems(data);
      }
      setLoading(false);
    };
    
    fetchItems();
  }, []);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  return (
    <div className={styles.homepageGrid}>
      {items.map((item) => {
        let Component = null;
        let isEdgeToEdge = false;
        let w = 1;
        let h = 1;

        if (item.layout_size === '2x2') { w = 2; h = 2; }
        if (item.layout_size === '4x2') { w = 4; h = 2; }
        
        // Map contentType to component
                if (item.content_type === 'image' && item.layout_size === '4x2') { Component = HeroBlock; }
        else if (item.content_type === 'image') { Component = ImageBlock; }
        else if (item.content_type === 'product') { Component = ProductBlock; }
        else if (item.content_type === 'text') { Component = TextBlock; }
        else if (item.content_type === 'spacer') { Component = SpacerBlock; }
        else if (item.content_type === 'collection-highlight') { Component = CollectionHighlight; }

        if (!Component || item.content_type === 'placeholder') return null;

let displayClass = '';
        if (item.layout_size === '4x2') {
          const mode = item.content_data?.displayMode || 'normal';
          if (mode === 'edge-to-edge') displayClass = styles.edgeToEdge;
          if (mode === 'full-width') displayClass = styles.fullWidth;
        }

        return (
          <div 
            key={item.id} 
            className={displayClass}
            style={{
              gridColumn: `span ${w}`,
              gridRow: `span ${h}`,
              aspectRatio: w === 4 && h === 2 ? '3/2' : '3/4',
              overflow: 'hidden'
            }}
          >
            <Component data={item.content_data} />
          </div>
        );
      })}
    </div>
  );
};

export default HomePage;
