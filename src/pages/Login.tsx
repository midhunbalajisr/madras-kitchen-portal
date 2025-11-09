import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import mecLogo from '@/assets/mec-logo-official.png';
import adminIcon from '@/assets/admin-icon.png';
import studentIcon from '@/assets/student-icon.png';
import canteenerIcon from '@/assets/canteener-icon.png';
import { ArrowLeft, UserPlus } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const loginOptions = [
    {
      title: 'Admin Login',
      description: 'Manage recharges and operations',
      image: adminIcon,
      path: '/admin',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Student Login',
      description: 'Order food and view menu',
      image: studentIcon,
      path: '/student',
      gradient: 'from-primary to-accent',
    },
    {
      title: 'Canteener Login',
      description: 'Manage orders and delivery',
      image: canteenerIcon,
      path: '/shopper',
      gradient: 'from-secondary to-pink-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex flex-col items-center justify-center p-4">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')}
        className="absolute top-4 left-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="w-full max-w-5xl space-y-8 animate-fade-in-up">
        <div className="text-center space-y-4">
          <img 
            src={mecLogo} 
            alt="MEC Logo" 
            className="w-24 h-24 mx-auto animate-bounce-in"
          />
          <h1 className="text-5xl md:text-6xl font-black text-foreground bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Madras Kitchen
          </h1>
          <p className="text-xl text-muted-foreground font-medium">Choose your role to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          <p className="text-muted-foreground">New student?</p>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/register')}
            className="gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Register Now
          </Button>
        </div>

        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            🎓 Powered by Madras Engineering College
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
