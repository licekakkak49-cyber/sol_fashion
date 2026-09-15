export const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise(resolve => { image.onload = resolve; });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');


  const MAX_WIDTH = 1200;
  let scale = 1;
  if (pixelCrop.width > MAX_WIDTH) {
    scale = MAX_WIDTH / pixelCrop.width;
  }

  canvas.width = Math.round(pixelCrop.width * scale);
  canvas.height = Math.round(pixelCrop.height * scale);

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise((resolve) => {
    // Export as WebP format with 0.82 quality for high compression and crisp resolution
    resolve(canvas.toDataURL('image/webp', 0.82));
  });
};
