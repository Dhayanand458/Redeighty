import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Edit, ArrowLeft, ArrowRight, Trash2, Save, Settings, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { TemplateCreatePopup } from '../components/TemplateCreatePopup';
import { TextImagePopup } from '../components/TextImagePopup';
import { getProjectData, updateProjectTemplates, deleteProject } from '../services/firestore';
import { Template } from '../types';
import { toast } from 'sonner';

export const BackgroundPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<number | null>(null);
  const [selectedTemplateForImages, setSelectedTemplateForImages] = useState<number | null>(null);
  const [selectedTextIndex, setSelectedTextIndex] = useState<number | null>(null);
  const [insertionIndex, setInsertionIndex] = useState<number | null>(null);
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
      const templatesWithImages = data.templates.map(template => {
        const textImages = template.textImages || {};
        const validSelectedIndex = Math.min(
          template.selectedIndex, 
          Math.max(0, template.texts.length - 1)
        );
        return {
          ...template,
          textImages,
          selectedIndex: validSelectedIndex
        };
      });
      setTemplates(templatesWithImages);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error loading project data:', error);
    }
  };

  const saveTemplate = (texts: string[], selectedIndex: number) => {
    if (editingTemplate !== null) {
      const newTemplates = [...templates];
      const oldTemplate = newTemplates[editingTemplate];
      
      const oldTextImages = oldTemplate.textImages || {};
      const newTextImages: { [key: number]: string[] } = {};
      
      let newIndex = 0;
      for (let oldIndex = 0; oldIndex < oldTemplate.texts.length; oldIndex++) {
        const oldText = oldTemplate.texts[oldIndex];
        if (oldText.trim()) {
          if (oldTextImages[oldIndex]) {
            newTextImages[newIndex] = oldTextImages[oldIndex];
          }
          newIndex++;
        }
      }
      
      newTemplates[editingTemplate] = {
        ...oldTemplate,
        texts,
        selectedIndex,
        textImages: newTextImages
      };
      setTemplates(newTemplates);
      setHasUnsavedChanges(true);
    } else {
      const newTemplate: Template = {
        id: templates.length + 1,
        texts,
        selectedIndex,
        textImages: {}
      };
      let newTemplates;
      if (insertionIndex !== null) {
        newTemplates = [
          ...templates.slice(0, insertionIndex + 1),
          newTemplate,
          ...templates.slice(insertionIndex + 1)
        ];
      } else {
        newTemplates = [...templates, newTemplate];
      }
      const renumberedTemplates = newTemplates.map((template, i) => ({
        ...template,
        id: i + 1
      }));
      setTemplates(renumberedTemplates);
      setHasUnsavedChanges(true);
    }
    setEditingTemplate(null);
    setInsertionIndex(null);
  };

  const deleteTemplate = (index: number) => {
    const newTemplates = templates.filter((_, i) => i !== index);
    const renumberedTemplates = newTemplates.map((template, i) => ({
      ...template,
      id: i + 1
    }));
    setTemplates(renumberedTemplates);
    setHasUnsavedChanges(true);
  };

  const navigateText = (templateIndex: number, direction: 'prev' | 'next') => {
    const template = templates[templateIndex];
    let newIndex = template.selectedIndex;
    
    if (direction === 'prev') {
      newIndex = newIndex > 0 ? newIndex - 1 : 0;
    } else {
      newIndex = newIndex < template.texts.length - 1 ? newIndex + 1 : template.texts.length - 1;
    }

    const newTemplates = [...templates];
    newTemplates[templateIndex] = { ...template, selectedIndex: newIndex };
    setTemplates(newTemplates);
    setHasUnsavedChanges(true);
  };

  const editTemplate = (index: number) => {
    setEditingTemplate(index);
    setShowCreatePopup(true);
  };

  const createNewTemplate = (afterIndex?: number) => {
    setEditingTemplate(null);
    setShowCreatePopup(true);
    if (afterIndex !== undefined) {
      setInsertionIndex(afterIndex);
    } else {
      setInsertionIndex(null);
    }
  };

  const openImageManager = (templateIndex: number, textIndex: number) => {
    setSelectedTemplateForImages(templateIndex);
    setSelectedTextIndex(textIndex);
    setShowImagePopup(true);
  };

  const saveTemplateImages = (images: string[]) => {
    if (selectedTemplateForImages !== null && selectedTextIndex !== null) {
      const newTemplates = [...templates];
      const template = newTemplates[selectedTemplateForImages];
      template.textImages = {
        ...template.textImages,
        [selectedTextIndex]: images
      };
      setTemplates(newTemplates);
      setHasUnsavedChanges(true);
    }
    setSelectedTemplateForImages(null);
    setSelectedTextIndex(null);
  };

  const handleDeleteProject = async () => {
    if (!code) return;
    try {
      await deleteProject(code);
      navigate('/');
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const saveAllTemplates = async () => {
    if (!code) return;
    try {
      await updateProjectTemplates(code, templates);
      setHasUnsavedChanges(false);
      toast.success('All templates saved successfully!');
    } catch (error) {
      console.error('Error saving templates:', error);
      toast.error('Failed to save templates. Please try again.');
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
                onClick={() => navigate(`/images/${code}`)}
                className="navigation-button"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold gradient-text">Background Templates</h1>
                <p className="text-muted-foreground mt-1">
                  Code: <span className="font-mono text-primary">{code}</span>
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              <button
                onClick={saveAllTemplates}
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
                onClick={() => setShowDeleteConfirm(true)}
                className="premium-button-destructive flex items-center justify-center space-x-2 px-6 py-3"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete Project</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Add Template Button */}
          <div className="text-center">
            <button
              onClick={() => createNewTemplate()}
              className="group premium-button-primary px-8 py-4 text-lg flex items-center space-x-3 mx-auto"
            >
              <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
              <span>Create Template</span>
            </button>
          </div>

          {/* Templates */}
          {templates.map((template, templateIndex) => (
            <div key={template.id} className="space-y-6">
              <div className="template-item animate-slide-up" style={{ animationDelay: `${templateIndex * 100}ms` }}>
                <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                  {/* Template Number */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">#{template.id}</span>
                    </div>
                  </div>

                  {/* Current Text Display */}
                  <button
                    onClick={() => openImageManager(templateIndex, template.selectedIndex)}
                    className="flex-1 w-full lg:w-auto text-left p-4 glass-card rounded-xl hover:scale-[1.01] transition-all duration-300 min-h-[60px] flex items-center space-x-3"
                  >
                    <ImageIcon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-lg font-medium">
                      {template.texts[template.selectedIndex] || 'Empty text'}
                    </span>
                  </button>

                  {/* Controls */}
                  <div className="flex space-x-3 w-full lg:w-auto">
                    <button
                      onClick={() => navigateText(templateIndex, 'prev')}
                      className="navigation-button"
                      disabled={template.selectedIndex === 0}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => navigateText(templateIndex, 'next')}
                      className="navigation-button"
                      disabled={template.selectedIndex === template.texts.length - 1}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => editTemplate(templateIndex)}
                      className="edit-button"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => deleteTemplate(templateIndex)}
                      className="delete-button"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Text Navigation Indicator */}
                <div className="flex items-center justify-center space-x-2 mt-4">
                  {template.texts.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === template.selectedIndex 
                          ? 'bg-primary w-8' 
                          : 'bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Add Template Button Between Items */}
              <div className="text-center">
                <button
                  onClick={() => createNewTemplate(templateIndex)}
                  className="w-12 h-12 rounded-full glass-button flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {templates.length === 0 && (
            <div className="text-center py-16 animate-scale-in">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6">
                <Settings className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No Templates Yet</h3>
              <p className="text-muted-foreground mb-8">
                Create your first background template to get started
              </p>
              <button
                onClick={() => createNewTemplate()}
                className="premium-button-primary px-8 py-4 text-lg"
              >
                Create First Template
              </button>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="premium-modal">
            <div className="premium-modal-content max-w-lg">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-destructive/20 to-red-500/20 flex items-center justify-center mx-auto">
                  <Trash2 className="w-8 h-8 text-destructive" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-2">Delete Project</h2>
                  <p className="text-muted-foreground">
                    Are you sure you want to permanently delete this project? This will remove all templates, texts, and images associated with code: 
                    <span className="font-mono text-primary block mt-2">{code}</span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="premium-button-secondary px-6 py-3"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteProject}
                    className="premium-button-destructive px-6 py-3"
                  >
                    Delete Forever
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <TemplateCreatePopup
          isOpen={showCreatePopup}
          onClose={() => {
            setShowCreatePopup(false);
            setEditingTemplate(null);
          }}
          onSave={saveTemplate}
          existingTexts={editingTemplate !== null ? templates[editingTemplate]?.texts : []}
          existingSelectedIndex={editingTemplate !== null ? templates[editingTemplate]?.selectedIndex : -1}
        />

        <TextImagePopup
          isOpen={showImagePopup}
          onClose={() => {
            setShowImagePopup(false);
            setSelectedTemplateForImages(null);
            setSelectedTextIndex(null);
          }}
          onSave={saveTemplateImages}
          existingImages={
            selectedTemplateForImages !== null && selectedTextIndex !== null
              ? (templates[selectedTemplateForImages]?.textImages?.[selectedTextIndex] || [])
              : []
          }
          textIndex={selectedTextIndex || 0}
        />
      </div>
    </div>
  );
};