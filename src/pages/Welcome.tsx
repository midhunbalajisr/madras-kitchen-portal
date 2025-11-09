import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import mecLogo from '@/assets/mec-logo-official.png';
import { useEffect } from 'react';
import { initializeDemoData } from '@/lib/storage';
import { Sparkles, ChefHat, UtensilsCrossed } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    initializeDemoData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero animate-gradient flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-white/20 animate-float">
        <UtensilsCrossed className="w-24 h-24" />
      </div>
      <div className="absolute bottom-10 right-10 text-white/20 animate-float" style={{ animationDelay: '1s' }}>
        <ChefHat className="w-24 h-24" />
      </div>

      <div className="text-center space-y-8 animate-fade-in-up relative z-10">
        <img 
          src={mecLogo} 
          alt="MEC Logo" 
          className="w-40 h-40 mx-auto animate-float drop-shadow-2xl"
        />
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 md:w-12 md:h-12 animate-pulse" />
            WELCOME TO
            <Sparkles className="w-10 h-10 md:w-12 md:h-12 animate-pulse" />
          </h1>
          <div className="relative">
            <h2 className="text-6xl md:text-9xl font-black bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent animate-gradient leading-tight tracking-tight">
              MADRAS
            </h2>
            <h2 className="text-6xl md:text-9xl font-black bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-transparent animate-gradient leading-tight tracking-tight shimmer">
              KITCHEN
            </h2>
          </div>
          <p className="text-2xl md:text-3xl text-white/95 font-semibold animate-bounce-in" style={{ animationDelay: '0.3s' }}>
            🍽️ Hub of Taste by Midhun Web World 🍽️
          </p>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Experience the finest culinary delights from Madras Engineering College's premier canteen
          </p>
        </div>
        <Button 
          variant="hero" 
          size="lg"
          onClick={() => navigate('/login')}
          className="text-xl px-16 py-8 rounded-full mt-8 shadow-strong hover:shadow-hover animate-bounce-in"
          style={{ animationDelay: '0.6s' }}
        >
          🚀 Enter Portal
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
