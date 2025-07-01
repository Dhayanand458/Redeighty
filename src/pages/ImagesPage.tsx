import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Plus, Settings, ArrowLeft, Image as ImageIcon } from 'lucide-react';
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
    
    if (imageToDelete && imageToDelete.trim() !== '') {
      deleteFromCloudinary(imageToDelete).catch(error => {
        console.error('Failed to delete image from Cloudinary:', error);
      });
    }
    
    if (newImages.length === 0) {
      setShowImageAreas(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="premium-header">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="navigation-button"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold gradient-text">Image Vault</h1>
                <p className="text-muted-foreground mt-1">
                  Code: <span className="font-mono text-primary">{code}</span>
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              <button
                onClick={saveAllImages}
                className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  hasUnsavedChanges 
                    ? 'premium-button-warning' 
                    : 'premium-button-success'
                }`}
              >
                <Save className="w-5 h-5" />
                <span>{hasUnsavedChanges ? 'Save Changes*' : 'All Saved'}</span>
              </button>
              
              <button
                onClick={() => navigate(`/background/${code}`)}
                className="premium-button-primary flex items-center justify-center space-x-2 px-6 py-3"
              >
                <Settings className="w-5 h-5" />
                <span>Background Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Add Image Button */}
          <div className="text-center">
            <button
              onClick={addImage}
              className="group premium-button-primary px-8 py-4 text-lg flex items-center space-x-3 mx-auto"
            >
              <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
              <span>Add New Image</span>
            </button>
          </div>

          {/* Images Grid */}
          {showImageAreas && (
            <div className="grid gap-8">
              {images.map((image, index) => (
                <div key={index} className="premium-card animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-white" />
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
          )}

          {/* Empty State */}
          {!showImageAreas && (
            <div className="text-center py-16 animate-scale-in">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No Images Yet</h3>
              <p className="text-muted-foreground mb-8">
                Start building your image collection by adding your first image
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