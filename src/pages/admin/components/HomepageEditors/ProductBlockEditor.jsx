import React, { useState, useEffect } from 'react';
import ProductCard from '../../../../components/ProductCard';
import ProductSelectionDrawer from './ProductSelectionDrawer';
import { supabase } from '../../../../lib/supabaseClient';

const ProductBlockEditor = ({ module, updateData }) => {
  const { data } = module;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (data?.productId) {
        const { data: prodData } = await supabase.from('products').select('*').eq('id', data.productId).single();
        if (prodData) {
          setProduct({
            ...prodData,
            image: prodData.cover_image_url,
            hoverImage: prodData.hover_image_url,
            colors: (prodData.color_variants || []).map(v => v.hex).filter(Boolean)
          });
        }
      }
    };
    fetchProduct();
  }, [data?.productId]);

  const handleSelect = (selectedProduct) => {
    updateData({ ...data, productId: selectedProduct.id });
    setIsDrawerOpen(false);
  };

  return (
    <>
      <div 
        style={{ cursor: 'pointer', position: 'relative', height: '100%', padding: '0 8px' }} 
        onClick={() => setIsDrawerOpen(true)}
      >
        {product ? (
          <div style={{ pointerEvents: 'none' }}>
            <ProductCard 
              id={product.id} image={product.image} hoverImage={product.hoverImage}
              name={product.name} price={product.price} colors={product.colors} isLarge={false}
            />
          </div>
        ) : (
          <div style={{ width: '100%', aspectRatio: '4/5', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
            Select Product
          </div>
        )}

        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.1)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: 'white', opacity: 0, transition: 'opacity 0.2s', zIndex: 10
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
        onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
        >
          <div style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.7)', borderRadius: '4px', fontSize: '14px' }}>
            Change Product
          </div>
        </div>
      </div>

      {isDrawerOpen && (
        <ProductSelectionDrawer onClose={() => setIsDrawerOpen(false)} onSelect={handleSelect} />
      )}
    </>
  );
};

export default ProductBlockEditor;
