import re

with open('src/pages/admin/components/HomepageEditorDrawer.jsx', 'r') as f:
    code = f.read()

replacement = """  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      let finalData = { ...formData };
      console.log("Saving formData from drawer:", finalData);
      
      // If image is a local base64 string, upload to Supabase
      if (!isTextModule && finalData.contentData.imageUrl?.startsWith('data:image')) {
        console.log("Uploading base64 image to Supabase...");
        const url = await uploadImageToSupabase(finalData.contentData.imageUrl, 'homepage');
        console.log("Upload successful, url:", url);
        finalData.contentData.imageUrl = url;
      }
      
      console.log("Calling onSave with:", finalData);
      onSave(finalData);
      onClose();
    } catch (error) {"""

code = code.replace("""  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      let finalData = { ...formData };
      
      // If image is a local base64 string, upload to Supabase
      if (!isTextModule && finalData.contentData.imageUrl?.startsWith('data:image')) {
        const url = await uploadImageToSupabase(finalData.contentData.imageUrl, 'homepage');
        finalData.contentData.imageUrl = url;
      }
      
      onSave(finalData);
      onClose();
    } catch (error) {""", replacement)

with open('src/pages/admin/components/HomepageEditorDrawer.jsx', 'w') as f:
    f.write(code)
