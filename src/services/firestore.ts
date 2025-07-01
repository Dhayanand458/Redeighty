import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ProjectData, Template } from '../types';
import { deleteFromCloudinary } from '../lib/cloudinary';

export const getProjectData = async (code: string): Promise<ProjectData> => {
  const docRef = doc(db, 'projects', code);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as ProjectData;
  } else {
    // Create new empty project
    const newProject: ProjectData = {
      images: [],
      templates: []
    };
    await setDoc(docRef, newProject);
    return newProject;
  }
};

export const updateProjectData = async (code: string, data: ProjectData): Promise<void> => {
  const docRef = doc(db, 'projects', code);
  await setDoc(docRef, data);
};

export const updateProjectImages = async (code: string, images: string[]): Promise<void> => {
  const docRef = doc(db, 'projects', code);
  await updateDoc(docRef, { images });
};

export const updateProjectTemplates = async (code: string, templates: Template[]): Promise<void> => {
  const docRef = doc(db, 'projects', code);
  await updateDoc(docRef, { templates });
};

export const deleteProject = async (code: string): Promise<void> => {
  const docRef = doc(db, 'projects', code);
  
  try {
    // First, get the project data to extract image URLs
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const projectData = docSnap.data() as ProjectData;
      
      // Delete all images from Cloudinary
      const allImages: string[] = [];
      
      // Add main project images
      allImages.push(...projectData.images);
      
      // Add template images
      projectData.templates.forEach(template => {
        Object.values(template.textImages || {}).forEach(images => {
          allImages.push(...images);
        });
      });
      
      // Delete each image from Cloudinary
      const deletePromises = allImages
        .filter(url => url && url.trim() !== '') // Filter out empty URLs
        .map(async (imageUrl) => {
          try {
            await deleteFromCloudinary(imageUrl);
            console.log('Processed image deletion from Cloudinary:', imageUrl);
          } catch (error) {
            console.warn('Could not delete image from Cloudinary (expected with unsigned uploads):', imageUrl, error);
            // Continue with other deletions even if one fails
          }
        });
      
      // Wait for all image deletions to complete
      await Promise.all(deletePromises);
    }
    
    // Finally, delete the project document from Firebase
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
