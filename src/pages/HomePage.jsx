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

const HomePage = ({ previewItems }) => {
  const [items, setItems] = useState(previewItems || []);
  const [loading, setLoading] = useState(!previewItems);

  useEffect(() => {
    if (previewItems) {
      setItems(previewItems.map(item => ({
        ...item,
        layout_size: item.layout_size || item.layoutSize || '1x1',
        content_type: item.content_type || item.contentType || 'placeholder',
        content_data: item.content_data || item.contentData || {}
      })));
      setLoading(false);
      return;
    }
    
    const fetchItems = async () => {
      try {
        // 1. Try to load published collection from store_settings (homepage_collections_v1)
        const { data: settingData } = await supabase
          .from('store_settings')
          .select('setting_value')
          .eq('key_name', 'homepage_collections_v1')
          .maybeSingle();

        if (settingData && Array.isArray(settingData.setting_value) && settingData.setting_value.length > 0) {
          const publishedCol = settingData.setting_value.find(c => c.status === 'published');
          if (publishedCol && Array.isArray(publishedCol.items) && publishedCol.items.length > 0) {
            setItems(publishedCol.items.map(item => ({
              ...item,
              layout_size: item.layout_size || item.layoutSize || '1x1',
              content_type: item.content_type || item.contentType || 'placeholder',
              content_data: item.content_data || item.contentData || {}
            })));
            setLoading(false);
            return;
          }
        }
      } catch (colErr) {
        console.warn("Could not fetch published collection, falling back to homepage_grid_items:", colErr);
      }

      // 2. Fallback to homepage_grid_items table
      const { data, error } = await supabase
        .from('homepage_grid_items')
        .select('*')
        .order('grid_index', { ascending: true });
        
      if (data) {
        setItems(data.map(item => ({
          ...item,
          layout_size: item.layout_size || item.layoutSize || '1x1',
          content_type: item.content_type || item.contentType || 'placeholder',
          content_data: item.content_data || item.contentData || {}
        })));
      }
      setLoading(false);
    };
    
    fetchItems();
  }, [previewItems]);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  // Calculate Logical Rows
  const rows = [];
  items.forEach(item => {
    const cData = item.content_data || item.contentData || {};
    const rowId = cData.logicalRowId || `default-${item.id}`;
    let row = rows.find(r => r.id === rowId);
    if (!row) {
      row = { id: rowId, items: [], isIndented: cData.isIndented || false };
      rows.push(row);
    }
    row.items.push(item);
    if (cData.isIndented) row.isIndented = true;
  });

  return (
    <div className={styles.homepageContainer}>
      <div className={styles.homepageGridWrapper}>
        {rows.map(row => (
          <div 
            key={row.id} 
            className={styles.homepageGrid} 
            style={{ 
               paddingLeft: row.isIndented ? '10%' : undefined,
               transition: 'padding-left 0.3s ease'
            }}
          >
            {row.items.map((item) => {
              let Component = null;
              let w = 1;
              let h = 1;

              const lSize = item.layout_size || item.layoutSize || '1x1';
              const cType = item.content_type || item.contentType || 'placeholder';
              const cData = item.content_data || item.contentData || {};

              if (lSize === '2x2') { w = 2; h = 2; }
              if (lSize === '4x2') { w = 4; h = 2; }
              if (lSize === '4x1') { w = 4; h = 1; }
              
              if (cType === 'image' && lSize === '4x2') { Component = HeroBlock; }
              else if (cType === 'image') { Component = ImageBlock; }
              else if (cType === 'product') { Component = ProductBlock; }
              else if (cType === 'text') { Component = TextBlock; }
              else if (cType === 'spacer') { Component = SpacerBlock; }
              else if (cType === 'collection-highlight') { Component = CollectionHighlight; }

              if (!Component || cType === 'placeholder') return null;

              let displayClass = '';
              if (lSize === '4x2') {
                const mode = cData.displayMode || 'normal';
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
                    aspectRatio: (displayClass === styles.fullWidth || cType === 'text' || cType === 'spacer') ? undefined : (w === 4 && h === 2 ? '3/2' : '3/4'),
                    overflow: 'hidden'
                  }}
                >
                  <Component data={cData} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;