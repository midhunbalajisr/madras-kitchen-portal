import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import mecLogo from '@/assets/mec-logo-official.png';
import studentIcon from '@/assets/student-icon.png';
import canteenerIcon from '@/assets/canteener-icon.png';
import { ArrowLeft, UserPlus, Utensils, Sparkles } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const loginOptions = [
    {
      title: 'Student Login',
      description: 'Order delicious food & view menu',
      image: studentIcon,
      path: '/student',
      gradient: 'from-teal-500 to-cyan-500',
    },
    {
      title: 'Canteener Login',
      description: 'Manage orders & delivery',
      image: canteenerIcon,
      path: '/shopper',
      gradient: 'from-violet-500 to-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 text-teal-200 animate-float">
        <Utensils className="w-20 h-20" />
      </div>
      <div className="absolute bottom-20 right-10 text-cyan-200 animate-float" style={{ animationDelay: '1s' }}>
        <Sparkles className="w-16 h-16" />
      </div>

      <Button 
        variant="ghost" 
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 hover:bg-teal-100"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="w-full max-w-3xl space-y-8 animate-fade-in-up relative z-10">
        <div className="text-center space-y-4">
          <img 
            src={mecLogo} 
            alt="MEC Logo" 
            className="w-28 h-28 mx-auto animate-bounce-in drop-shadow-xl"
          />
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
            Madras Kitchen
          </h1>
          <p className="text-xl text-teal-700/70 font-medium">Select your portal to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loginOptions.map((option, index) => (
            <Card 
              key={index}
              className="hover:shadow-strong transition-smooth cursor-pointer group overflow-hidden border-2 hover:border-primary"
              onClick={() => navigate(option.path)}
            >
              <div className={`h-3 bg-gradient-to-r ${option.gradient}`}></div>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-32 h-32 rounded-full overflow-hidden group-hover:scale-110 transition-smooth shadow-card">
                  <img src={option.image} alt={option.title} className="w-full h-full object-cover" />
                </div>
                <CardTitle className="text-2xl font-bold">{option.title}</CardTitle>
                <CardDescription className="text-base">{option.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  className={`w-full bg-gradient-to-r ${option.gradient} text-white hover:opacity-90`}
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(option.path);
                  }}
                >
                  Login as {option.title.split(' ')[0]}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-4">
          <p className="text-teal-700/70">New student?</p>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/register')}
            className="gap-2 border-teal-300 text-teal-700 hover:bg-teal-50"
          >
            <UserPlus className="w-4 h-4" />
            Register Now
          </Button>
        </div>

        <div className="text-center pt-4">
          <p className="text-sm text-teal-600/60">
            🎓 Powered by Madras Engineering College
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
