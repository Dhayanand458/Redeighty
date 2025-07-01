import React, { useState, useEffect } from 'react';
import { X, Plus, Type, Check } from 'lucide-react';

interface TemplateCreatePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (texts: string[], selectedIndex: number) => void;
  existingTexts?: string[];
  existingSelectedIndex?: number;
}

export const TemplateCreatePopup: React.FC<TemplateCreatePopupProps> = ({
  isOpen,
  onClose,
  onSave,
  existingTexts = [],
  existingSelectedIndex = -1
}) => {
  const [texts, setTexts] = useState<string[]>(existingTexts.length > 0 ? existingTexts : ['']);
  const [selectedIndex, setSelectedIndex] = useState(existingSelectedIndex >= 0 ? existingSelectedIndex : -1);

  useEffect(() => {
    if (isOpen) {
      if (existingTexts.length > 0) {
        setTexts(existingTexts);
        setSelectedIndex(existingSelectedIndex);
      } else {
        setTexts(['']);
        setSelectedIndex(-1);
      }
    }
  }, [isOpen, existingTexts, existingSelectedIndex]);

  if (!isOpen) return null;

  const addText = () => {
    setTexts([...texts, '']);
  };

  const updateText = (index: number, value: string) => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };

  const deleteText = (index: number) => {
    const newTexts = texts.filter((_, i) => i !== index);
    setTexts(newTexts);
    if (selectedIndex === index) {
      setSelectedIndex(-1);
    } else if (selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleSave = () => {
    if (selectedIndex >= 0 && texts[selectedIndex]?.trim()) {
      const nonEmptyTexts = texts.filter(t => t.trim());
      
      if (nonEmptyTexts.length === 0) {
        return;
      }
      
      const adjustedSelectedIndex = Math.min(selectedIndex, nonEmptyTexts.length - 1);
      
      onSave(nonEmptyTexts, adjustedSelectedIndex);
      onClose();
    }
  };

  return (
    <div className="premium-modal">
      <div className="premium-modal-content max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
              <Type className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold gradient-text">Template Editor</h2>
              <p className="text-muted-foreground">Create and manage text variations</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-xl glass-button flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Add Text Button */}
        <div className="text-center mb-8">
          <button
            onClick={addText}
            className="premium-button-primary flex items-center space-x-2 mx-auto px-6 py-3"
          >
            <Plus className="w-5 h-5" />
            <span>Add Text Variation</span>
          </button>
        </div>

        {/* Text Items */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {texts.map((text, index) => (
            <div key={index} className="glass-card rounded-xl p-4 space-y-3 animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  selectedIndex === index 
                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                
                <input
                  type="text"
                  value={text}
                  onChange={(e) => updateText(index, e.target.value)}
                  onClick={() => setSelectedIndex(index)}
                  className={`flex-1 premium-input ${
                    selectedIndex === index ? 'ring-2 ring-primary/50 border-primary/50' : ''
                  }`}
                  placeholder="Enter text variation"
                />
                
                <button
                  onClick={() => deleteText(index)}
                  className="w-10 h-10 rounded-lg glass-button flex items-center justify-center text-destructive hover:bg-destructive/10 transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedIndex(index)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedIndex === index
                      ? 'premium-button-success'
                      : 'premium-button-secondary'
                  }`}
                  disabled={!text.trim()}
                >
                  {selectedIndex === index ? (
                    <span className="flex items-center justify-center space-x-2">
                      <Check className="w-4 h-4" />
                      <span>Selected</span>
                    </span>
                  ) : (
                    'Select as Active'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        {selectedIndex >= 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <button
              onClick={handleSave}
              className="w-full premium-button-primary py-4 text-lg"
            >
              Save Template
            </button>
          </div>
        )}
      </div>
    </div>
  );
};