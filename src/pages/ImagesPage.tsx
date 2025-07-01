import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { ImageArea } from '../components/ImageArea';
import { getProjectData, updateProjectImages } from '../services/firestore';
import { deleteFromCloudinary } from '../lib/cloudinary';
import { toast } from 'sonner';

export const ImagesPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [showImageAreas, setShowImageAreas] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (code) {
      loadProjectData();
    }
  }, [code]);

  const loadProjectData = async () => {
    if (!code) return;
    try {
      const data = await getProjectData(code);
      setImages(data.images);
      setShowImageAreas(data.images.length > 0);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error loading project data:', error);
    }
  };

  const saveAllImages = async () => {
    if (!code) return;
    try {
      await updateProjectImages(code, images);
      setHasUnsavedChanges(false);
      toast.success('All images saved successfully!');
    } catch (error) {
      console.error('Error saving images:', error);
      toast.error('Failed to save images. Please try again.');
    }
  };

  const addImage = () => {
    setShowImageAreas(true);
    const newImages = [...images, ''];
    setImages(newImages);
    setHasUnsavedChanges(true);
  };

  const updateImage = (index: number, image: string) => {
    const newImages = [...images];
    newImages[index] = image;
    setImages(newImages);
    setHasUnsavedChanges(true);
  };

  const deleteImage = (index: number) => {
    console.log('ImagesPage: deleteImage called with index:', index);
    const imageToDelete = images[index];
    const newImages = images.filter((_, i) => i !== index);
    console.log('ImagesPage: newImages after delete:', newImages);
    setImages(newImages);
    setHasUnsavedChanges(true);
    
    // Delete image from Cloudinary
    if (imageToDelete && imageToDelete.trim() !== '') {
      deleteFromCloudinary(imageToDelete).catch(error => {
        console.error('Failed to delete image from Cloudinary:', error);
        // Don't show error toast since this is expected behavior with unsigned uploads
      });
    }
    
    if (newImages.length === 0) {
      setShowImageAreas(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-xl md:text-2xl font-bold">Code: {code}</h1>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={saveAllImages}
              className={`px-6 py-3 rounded flex items-center justify-center touch-manipulation ${
                hasUnsavedChanges 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              <Save size={20} className="mr-2" />
              {hasUnsavedChanges ? 'Save All*' : 'Save All'}
            </button>
            <button
              onClick={() => navigate(`/background/${code}`)}
              className="w-full sm:w-auto bg-purple-500 text-white px-6 py-3 rounded hover:bg-purple-600 touch-manipulation"
            >
              Go to Background
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <button
            onClick={addImage}
            className="w-full sm:w-auto bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 touch-manipulation"
          >
            Add Image
          </button>

          {showImageAreas && (
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
          )}
        </div>
      </div>
    </div>
  );
};