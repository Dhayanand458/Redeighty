import React, { useState, useEffect } from 'react';
import { X, Plus, Image as ImageIcon, Save } from 'lucide-react';
import { ImageArea } from './ImageArea';
import { deleteFromCloudinary } from '../lib/cloudinary';

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
    
    if (imageToDelete && imageToDelete.trim() !== '') {
      deleteFromCloudinary(imageToDelete).catch(error => {
        console.error('Failed to delete image from Cloudinary:', error);
      });
    }
  };

  const handleSave = () => {
    onSave(images.filter(img => img.trim()));
    onClose();
  };

  return (
    <div className="premium-modal">
      <div className="glass-card rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-white/10 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold gradient-text">Image Manager</h2>
              <p className="text-muted-foreground">Text Variation #{textIndex + 1}</p>
            </div>
          </div>
          
          <div className="flex space-x-3 w-full sm:w-auto">
            <button 
              onClick={handleSave} 
              className="flex-1 sm:flex-none premium-button-success px-6 py-3 flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
            <button 
              onClick={onClose} 
              className="w-12 h-12 rounded-xl glass-button flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Add Image Button */}
        <div className="p-6 border-b border-white/10">
          <button
            onClick={addImage}
            className="premium-button-primary flex items-center space-x-2 mx-auto px-6 py-3"
          >
            <Plus className="w-5 h-5" />
            <span>Add Image</span>
          </button>
        </div>

        {/* Images Grid */}
        <div className="overflow-y-auto flex-1 p-6">
          {images.length > 0 ? (
            <div className="grid gap-6">
              {images.map((image, index) => (
                <div key={index} className="premium-card animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <h3 className="text-lg font-semibold">Image #{index + 1}</h3>
                  </div>
                  <ImageArea
                    image={image}
                    onImageChange={(newImage) => updateImage(index, newImage)}
                    onDelete={() => deleteImage(index)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 animate-scale-in">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No Images Yet</h3>
              <p className="text-muted-foreground mb-8">
                Add images for this text variation
              </p>
              <button
                onClick={addImage}
                className="premium-button-primary px-8 py-4 text-lg"
              >
                Add First Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};