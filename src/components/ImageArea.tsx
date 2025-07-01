import React, { useRef } from 'react';
import { uploadToCloudinary } from '../lib/cloudinary';
import { Upload, Image as ImageIcon, Trash2, Camera } from 'lucide-react';

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
    <div className="relative group">
      <div
        className={`image-upload-area min-h-64 md:min-h-80 flex flex-col items-center justify-center transition-all duration-300 ${
          isSelected ? 'active' : ''
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handleClick}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        tabIndex={0}
      >
        {image ? (
          <div className="w-full h-full flex items-center justify-center p-4">
            <img 
              src={image} 
              alt="Uploaded" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
              style={{ 
                maxHeight: '400px',
                width: 'auto',
                height: 'auto'
              }}
            />
          </div>
        ) : isUploading ? (
          <div className="text-center p-8">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-muted-foreground">Uploading image...</p>
          </div>
        ) : (
          <div className="text-center p-8">
            {isSelected ? (
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary/20 to-blue-500/20 flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-foreground mb-4 text-lg font-medium">Ready to upload</p>
                  <p className="text-muted-foreground text-sm mb-6">
                    Paste an image or click the button below
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileUpload();
                    }}
                    className="premium-button-primary flex items-center space-x-2 mx-auto"
                    disabled={isUploading}
                  >
                    <Upload className="w-5 h-5" />
                    <span>Choose File</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary/20 to-blue-500/20 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-foreground text-lg font-medium mb-2">Add Image</p>
                  <p className="text-muted-foreground text-sm">
                    Click to select, then paste or upload
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {image && (
        <button
          onClick={handleDelete}
          className="absolute top-4 right-4 delete-button opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <Trash2 className="w-5 h-5" />
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