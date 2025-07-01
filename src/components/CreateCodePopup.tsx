import React, { useState } from 'react';
import { X } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Create Code</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded touch-manipulation"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code (e.g., F78j87I)"
            className="w-full p-4 border rounded-lg text-lg"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 text-lg font-medium touch-manipulation"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};