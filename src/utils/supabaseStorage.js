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

export const uploadImageToSupabase = async (base64Image, folder = 'products') => {
  if (!base64Image) return null;
  
  // If it's already a URL, return it
  if (base64Image.startsWith('http')) return base64Image;
  
  // Convert base64 to blob
  const blob = dataURLtoBlob(base64Image);
  const ext = blob.type.split('/')[1] || 'jpg';
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
  
  const { data, error } = await supabase
    .storage
    .from('product-images')
    .upload(fileName, blob, {
      cacheControl: '3600',
      upsert: false
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
