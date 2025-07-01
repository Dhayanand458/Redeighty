import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateCodePopup } from '../components/CreateCodePopup';
import { getProjectData } from '../services/firestore';
import { toast } from 'sonner';

export const LandingPage: React.FC = () => {
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [enterCode, setEnterCode] = useState('');
  const [showEnterField, setShowEnterField] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();

  const handleCreateCode = (code: string) => {
    navigate(`/images/${code}`);
  };

  const handleEnterCode = async () => {
    if (!enterCode.trim()) return;
    
    setIsChecking(true);
    try {
      const data = await getProjectData(enterCode.trim());
      if (data.templates.length === 0) {
        // If the project exists but has no templates, it's a new project
        toast.error('This code does not exist. Please create a new code instead.');
        setShowEnterField(false);
        setEnterCode('');
      } else {
        navigate(`/images/${enterCode.trim()}`);
      }
    } catch (error) {
      toast.error('This code does not exist. Please create a new code instead.');
      setShowEnterField(false);
      setEnterCode('');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center space-y-6 w-full max-w-sm">
        <button
          onClick={() => setShowCreatePopup(true)}
          className="block w-full bg-blue-500 text-white py-4 px-6 rounded-lg hover:bg-blue-600 text-lg font-medium touch-manipulation"
        >
          Create Code
        </button>
        
        <button
          onClick={() => setShowEnterField(true)}
          className="block w-full bg-green-500 text-white py-4 px-6 rounded-lg hover:bg-green-600 text-lg font-medium touch-manipulation"
        >
          Enter Code
        </button>

        {showEnterField && (
          <div className="mt-6 space-y-4">
            <input
              type="text"
              value={enterCode}
              onChange={(e) => setEnterCode(e.target.value)}
              placeholder="Enter existing code"
              className="w-full p-4 border rounded-lg text-lg"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEnterCode();
                }
              }}
            />
            <button
              onClick={handleEnterCode}
              disabled={isChecking}
              className={`block w-full bg-gray-500 text-white py-4 px-6 rounded-lg text-lg font-medium touch-manipulation ${
                isChecking ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
              }`}
            >
              {isChecking ? 'Checking...' : 'Access Code'}
            </button>
          </div>
        )}
      </div>

      <CreateCodePopup
        isOpen={showCreatePopup}
        onClose={() => setShowCreatePopup(false)}
        onCreateCode={handleCreateCode}
      />
    </div>
  );
};