import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

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
      // Filter out completely empty texts
      const nonEmptyTexts = texts.filter(t => t.trim());
      
      // Ensure we have at least one text
      if (nonEmptyTexts.length === 0) {
        return; // Don't save if no valid texts
      }
      
      // Adjust selectedIndex to be within bounds
      const adjustedSelectedIndex = Math.min(selectedIndex, nonEmptyTexts.length - 1);
      
      onSave(nonEmptyTexts, adjustedSelectedIndex);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Create Template</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded touch-manipulation"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="text-center mb-6">
          <button
            onClick={addText}
            className="flex items-center justify-center mx-auto p-3 bg-blue-500 text-white rounded touch-manipulation"
          >
            <Plus size={16} className="mr-1" />
            Add Text
          </button>
        </div>

        <div className="space-y-4">
          {texts.map((text, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium min-w-[20px]">{index + 1}.</span>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => updateText(index, e.target.value)}
                  onClick={() => setSelectedIndex(index)}
                  className={`flex-1 p-3 border rounded-lg text-lg ${
                    selectedIndex === index ? 'border-green-500 bg-green-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter text"
                />
                <button
                  onClick={() => deleteText(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSave()}
                  className="flex-1 px-3 py-2 bg-green-500 text-white rounded text-sm touch-manipulation"
                  disabled={selectedIndex !== index || !text.trim()}
                >
                  Done
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedIndex >= 0 && (
          <div className="mt-6">
            <button
              onClick={handleSave}
              className="w-full bg-blue-500 text-white p-4 rounded-lg text-lg font-medium touch-manipulation"
            >
              Save Template
            </button>
          </div>
        )}
      </div>
    </div>
  );
};