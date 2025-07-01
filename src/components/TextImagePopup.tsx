import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { ImageArea } from './ImageArea';
import { deleteFromCloudinary } from '../lib/cloudinary';
import { toast } from 'sonner';

interface TextImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (images: string[]) => void;
  existingImages: string[];
  textIndex: number;
}

export const TextImagePopup: React.FC<TextImagePopupProps> = ({
  isOpen,
  onClose,
  onSave,
  existingImages,
  textIndex
}) => {
  const [images, setImages] = useState<string[]>(existingImages);

  useEffect(() => {
    if (isOpen) {
      setImages(existingImages);
    }
  }, [isOpen, existingImages]);

  if (!isOpen) return null;

  const addImage = () => {
    setImages([...images, '']);
  };

  const updateImage = (index: number, image: string) => {
    const newImages = [...images];
    newImages[index] = image;
    setImages(newImages);
  };

  const deleteImage = (index: number) => {
    console.log('TextImagePopup: deleteImage called with index:', index);
    const imageToDelete = images[index];
    const newImages = images.filter((_, i) => i !== index);
    console.log('TextImagePopup: newImages after delete:', newImages);
    setImages(newImages);
    
    // Delete image from Cloudinary
    if (imageToDelete && imageToDelete.trim() !== '') {
      deleteFromCloudinary(imageToDelete).catch(error => {
        console.error('Failed to delete image from Cloudinary:', error);
        // Don't show error toast since this is expected behavior with unsigned uploads
      });
    }
  };

  const handleSave = () => {
    onSave(images.filter(img => img.trim()));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b sticky top-0 bg-white z-10 space-y-2 sm:space-y-0">
          <h2 className="text-lg font-semibold">Manage Images for Text #{textIndex + 1}</h2>
          <div className="flex space-x-2 w-full sm:w-auto">
            <button 
              onClick={handleSave} 
              className="flex-1 sm:flex-none bg-green-500 text-white px-4 py-3 rounded hover:bg-green-600 touch-manipulation"
            >
              Done
            </button>
            <button 
              onClick={onClose} 
              className="p-3 hover:bg-gray-100 rounded touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-4 border-b">
          <button
            onClick={addImage}
            className="flex items-center justify-center mx-auto p-3 bg-blue-500 text-white rounded hover:bg-blue-600 touch-manipulation"
          >
            <Plus size={16} className="mr-1" />
            Create Image
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          <div className="space-y-6">
            {images.map((image, index) => (
              <ImageArea
                key={index}
                image={image}
                onImageChange={(newImage) => updateImage(index, newImage)}
                onDelete={() => deleteImage(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};