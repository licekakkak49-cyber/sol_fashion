export const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise(resolve => { image.onload = resolve; });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');


  const MAX_WIDTH = 800;
  let scale = 1;
  if (pixelCrop.width > MAX_WIDTH) {
    scale = MAX_WIDTH / pixelCrop.width;
  }

  canvas.width = pixelCrop.width * scale;
  canvas.height = pixelCrop.height * scale;

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
    // Drop quality to 0.7 for even smaller base64
    resolve(canvas.toDataURL('image/jpeg', 0.7));
  });
};
