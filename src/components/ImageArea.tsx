import React, { useRef } from 'react';
import { uploadToCloudinary } from '../lib/cloudinary';

interface ImageAreaProps {
  image?: string;
  onImageChange: (image: string) => void;
  onDelete: () => void;
}

export const ImageArea: React.FC<ImageAreaProps> = ({ image, onImageChange, onDelete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSelected, setIsSelected] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleClick = () => {
    setIsSelected(true);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(file);
      onImageChange(url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          uploadImage(blob);
        }
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files[0]) {
      uploadImage(files[0]);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Delete button clicked, calling onDelete');
    onDelete();
  };

  return (
    <div className="relative">
      <div
        className={`border-2 border-dashed p-4 min-h-48 md:min-h-64 flex flex-col items-center justify-center cursor-pointer touch-manipulation ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleClick}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        tabIndex={0}
      >
        {image ? (
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={image} 
              alt="Uploaded" 
              className="max-w-full max-h-full object-contain rounded"
              style={{ 
                maxHeight: '400px',
                width: 'auto',
                height: 'auto'
              }}
            />
          </div>
        ) : isUploading ? (
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Uploading image...</p>
          </div>
        ) : (
          <div className="text-center p-4">
            {isSelected ? (
              <div className="space-y-4">
                <p className="text-gray-600 mb-4 text-sm md:text-base">Now you can paste an image or click upload button below</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileUpload();
                  }}
                  className="text-blue-500 underline text-lg py-2 px-4 touch-manipulation"
                  disabled={isUploading}
                >
                  Click to upload
                </button>
              </div>
            ) : (
              <p className="text-gray-600 text-sm md:text-base">Image - Click to select, then paste or upload</p>
            )}
          </div>
        )}
      </div>
      
      {image && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center z-10"
        >
          Delete
        </button>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};