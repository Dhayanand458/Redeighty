import React, { useState } from 'react';
import { X, Key, Sparkles } from 'lucide-react';

interface CreateCodePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCode: (code: string) => void;
}

export const CreateCodePopup: React.FC<CreateCodePopupProps> = ({
  isOpen,
  onClose,
  onCreateCode
}) => {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (code.trim()) {
      onCreateCode(code.trim());
      setCode('');
      onClose();
    }
  };

  return (
    <div className="premium-modal">
      <div className="premium-modal-content">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold gradient-text">Create Code</h2>
              <p className="text-muted-foreground">Generate your secure access key</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-xl glass-button flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Your Unique Code</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g., MyProject2024"
              className="w-full premium-input text-lg"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Choose a memorable code for easy access
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!code.trim()}
            className={`w-full premium-button-primary py-4 text-lg ${
              !code.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Create Vault
          </button>
        </div>
      </div>
    </div>
  );
};