import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateCodePopup } from '../components/CreateCodePopup';
import { getProjectData } from '../services/firestore';
import { toast } from 'sonner';
import { Plus, ArrowRight, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 text-center space-y-8 w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="space-y-4 mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold gradient-text">CodeVault</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Secure image management with premium experience
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => setShowCreatePopup(true)}
            className="group w-full premium-button-primary flex items-center justify-center space-x-3 py-4 text-lg animate-slide-up"
          >
            <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
            <span>Create New Code</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
          
          <button
            onClick={() => setShowEnterField(true)}
            className="group w-full premium-button-secondary flex items-center justify-center space-x-3 py-4 text-lg animate-slide-up delay-100"
          >
            <span>Enter Existing Code</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Enter Code Field */}
        {showEnterField && (
          <div className="space-y-4 animate-scale-in">
            <div className="premium-divider"></div>
            <input
              type="text"
              value={enterCode}
              onChange={(e) => setEnterCode(e.target.value)}
              placeholder="Enter your access code"
              className="w-full premium-input text-lg"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEnterCode();
                }
              }}
            />
            <button
              onClick={handleEnterCode}
              disabled={isChecking || !enterCode.trim()}
              className={`w-full premium-button-primary py-4 text-lg flex items-center justify-center space-x-2 ${
                isChecking || !enterCode.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isChecking ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Access Vault</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Powered by premium design & security
          </p>
        </div>
      </div>

      <CreateCodePopup
        isOpen={showCreatePopup}
        onClose={() => setShowCreatePopup(false)}
        onCreateCode={handleCreateCode}
      />
    </div>
  );
};