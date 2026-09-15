import { supabase } from './supabaseClient';

function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Converts a base64 image string to WebP format with resizing
 */
export const convertBase64ToWebP = (base64Str, maxWidth = 1200, quality = 0.82) => {
  if (!base64Str || typeof base64Str !== 'string') return Promise.resolve(base64Str);
  if (!base64Str.startsWith('data:image/')) return Promise.resolve(base64Str);
  if (base64Str.startsWith('data:image/webp') || base64Str.startsWith('data:image/svg+xml')) {
    return Promise.resolve(base64Str);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      try {
        const webpData = canvas.toDataURL('image/webp', quality);
        resolve(webpData);
      } catch (err) {
        console.warn('Canvas toDataURL WebP error, using original:', err);
        resolve(base64Str);
      }
    };
    img.onerror = () => resolve(base64Str);
    img.src = base64Str;
  });
};

/**
 * Converts an image File/Blob to a WebP File object with resizing
 */
export const convertFileToWebP = (file, maxWidth = 1600, quality = 0.82) => {
  if (!file || !file.type || !file.type.startsWith('image/')) return Promise.resolve(file);
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return Promise.resolve(file);

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const baseName = (file.name || 'image').replace(/\.[^/.]+$/, '');
          const webpFile = new File([blob], `${baseName}.webp`, { type: 'image/webp' });
          resolve(webpFile);
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
};

export const uploadImageToSupabase = async (base64Image, folder = 'products') => {
  if (!base64Image) return null;
  
  // If it's already a URL, return it
  if (base64Image.startsWith('http')) return base64Image;
  
  // Ensure non-webp images get converted and compressed to WebP
  let processedBase64 = base64Image;
  if (base64Image.startsWith('data:image/') && !base64Image.startsWith('data:image/webp') && !base64Image.startsWith('data:image/svg+xml')) {
    try {
      processedBase64 = await convertBase64ToWebP(base64Image);
    } catch (e) {
      console.warn('WebP conversion fallback:', e);
    }
  }

  // Convert base64 to blob
  const blob = dataURLtoBlob(processedBase64);
  const rawExt = (blob.type || '').split('/')[1] || 'webp';
  const ext = rawExt === 'jpeg' ? 'jpg' : rawExt;
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
  
  const { data, error } = await supabase
    .storage
    .from('product-images')
    .upload(fileName, blob, {
      cacheControl: '3600',
      upsert: false,
      contentType: blob.type || 'image/webp'
    });
    
  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
  
  // Get public URL
  const { data: publicUrlData } = supabase
    .storage
    .from('product-images')
    .getPublicUrl(fileName);
    
  return publicUrlData.publicUrl;
};

export const uploadFileToSupabase = async (file, folder = 'homepage-videos') => {
  if (!file) return null;
  if (typeof file === 'string' && file.startsWith('http')) return file;
  
  // Convert custom uploaded images to WebP
  let uploadFile = file;
  if (file.type && file.type.startsWith('image/') && file.type !== 'image/svg+xml' && file.type !== 'image/gif') {
    try {
      uploadFile = await convertFileToWebP(file);
    } catch (err) {
      console.warn('WebP conversion failed, uploading original file:', err);
    }
  }

  const ext = uploadFile.name ? uploadFile.name.split('.').pop() : (uploadFile.type?.split('/')[1] || 'mp4');
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
  
  const { data, error } = await supabase
    .storage
    .from('product-images')
    .upload(fileName, uploadFile, {
      cacheControl: '3600',
      upsert: false,
      contentType: uploadFile.type || (isVideoMedia(uploadFile.name) ? 'video/mp4' : 'image/webp')
    });
    
  if (error) {
    console.error('Error uploading file to Supabase:', error);
    throw error;
  }
  
  const { data: publicUrlData } = supabase
    .storage
    .from('product-images')
    .getPublicUrl(fileName);
    
  return publicUrlData.publicUrl;
};

export const isVideoMedia = (url) => {
  if (!url || typeof url !== 'string') return false;
  if (url.startsWith('data:video')) return true;
  if (url.startsWith('blob:')) return true;

  const cleanUrl = url.split('?')[0].split('#')[0].toLowerCase();
  const videoExtensions = ['.mp4', '.webm', '.mov', '.m4v', '.ogv', '.ogg'];
  if (videoExtensions.some(ext => cleanUrl.endsWith(ext))) {
    return true;
  }

  if (/\.(mp4|webm|mov|m4v|ogv|ogg)($|\?)/i.test(url)) {
    return true;
  }

  return false;
};
