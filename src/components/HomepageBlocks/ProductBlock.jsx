import React, { useEffect, useState } from 'react';
import ProductCard from '../ProductCard';
import { supabase } from '../../lib/supabaseClient';

const ProductBlock = ({ data }) => {
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

  if (!product && !data?.productId) {
    return <div style={{ aspectRatio: '4/5', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Empty Product</div>;
  }

  if (!product) return <div style={{ aspectRatio: '4/5', background: '#f9fafb' }}></div>;

  return (
    <div style={{ padding: '0 8px' }}>
      <ProductCard 
        id={product.id}
        image={product.image}
        hoverImage={product.hoverImage}
        name={product.name}
        price={product.price}
        colors={product.colors}
        isLarge={false}
      />
    </div>
  );
};

export default ProductBlock;
