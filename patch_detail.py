import re
with open('src/pages/ProductDetailPage.jsx', 'r') as f:
    code = f.read()

# Update displayImages
old_display = """  const displayImages = product 
    ? [
        activeVariant ? activeVariant.image : product.image, 
        activeVariant ? null : product.hoverImage, 
        ...(product.galleryImages || [])
      ].filter(Boolean)
    : MOCK_IMAGES;"""

new_display = """  const displayImages = product 
    ? (activeVariant && activeVariant.images && activeVariant.images.length > 0
        ? activeVariant.images
        : [product.image, product.hoverImage, ...(product.galleryImages || [])].filter(Boolean)
      )
    : MOCK_IMAGES;"""

code = code.replace(old_display, new_display)

with open('src/pages/ProductDetailPage.jsx', 'w') as f:
    f.write(code)

with open('src/components/ProductCard.jsx', 'r') as f:
    card_code = f.read()

old_card = """  const currentImage = activeVariantIdx >= 0 && colorVariants[activeVariantIdx]?.image ? colorVariants[activeVariantIdx].image : image;
  const currentHoverImage = activeVariantIdx >= 0 && colorVariants[activeVariantIdx]?.image ? null : hoverImage;
  const images = currentHoverImage ? [currentImage, currentHoverImage] : [currentImage];"""

new_card = """  let currentImage = image;
  let currentHoverImage = hoverImage;
  
  if (activeVariantIdx >= 0 && colorVariants[activeVariantIdx]?.images?.length > 0) {
    currentImage = colorVariants[activeVariantIdx].images[0];
    currentHoverImage = colorVariants[activeVariantIdx].images[1] || null;
  } else if (activeVariantIdx >= 0 && colorVariants[activeVariantIdx]?.image) {
    // Legacy support
    currentImage = colorVariants[activeVariantIdx].image;
    currentHoverImage = null;
  }

  const images = currentHoverImage ? [currentImage, currentHoverImage] : [currentImage];"""

card_code = card_code.replace(old_card, new_card)

with open('src/components/ProductCard.jsx', 'w') as f:
    f.write(card_code)
