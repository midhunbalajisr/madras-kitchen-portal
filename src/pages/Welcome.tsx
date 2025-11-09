import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import mecLogo from '@/assets/mec-logo.png';
import { useEffect } from 'react';
import { initializeDemoData } from '@/lib/storage';

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    initializeDemoData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero animate-gradient flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 animate-fade-in-up">
        <img 
          src={mecLogo} 
          alt="MEC Logo" 
          className="w-32 h-32 mx-auto animate-float"
        />
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
            WELCOME TO
          </h1>
          <h2 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent animate-gradient">
            MADRAS KITCHEN
          </h2>
          <p className="text-xl md:text-2xl text-white/90 font-medium">
            Hub of Taste by Midhun Web World
          </p>
        </div>
        <Button 
          variant="hero" 
          size="lg"
          onClick={() => navigate('/login')}
          className="text-lg px-12 py-6 rounded-full mt-8"
        >
          Enter Portal
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
