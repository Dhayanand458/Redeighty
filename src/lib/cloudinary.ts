export async function uploadToCloudinary(file: File): Promise<string> {
  const url = `https://api.cloudinary.com/v1_1/dazqhxnuk/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'unsigned_preset');

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary upload failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.secure_url) {
      throw new Error('No URL returned from Cloudinary');
    }
    
    return data.secure_url as string; // This is the image URL to store in Firestore
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  // For unsigned uploads, we cannot delete images via API without authentication
  // This is a limitation of Cloudinary's security model
  // The image will remain in Cloudinary but won't be accessible via the stored URL
  
  console.warn('Cannot delete image from Cloudinary with unsigned uploads:', publicId);
  console.warn('Image will remain in Cloudinary storage but is no longer accessible via the URL');
  
  // For now, we'll just log this and not throw an error
  // The image is effectively "deleted" from the user's perspective since the URL is removed from the project
  
  // TODO: If you want to enable image deletion, you would need to:
  // 1. Set up signed uploads with API key and secret
  // 2. Use the signed delete API
  // 3. Or use Cloudinary's admin API with proper authentication
  
  return Promise.resolve();
} 