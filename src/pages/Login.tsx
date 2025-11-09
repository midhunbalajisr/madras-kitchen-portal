import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import mecLogo from '@/assets/mec-logo.png';
import { UserCircle, Shield, ShoppingBag } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const loginOptions = [
    {
      title: 'Admin Login',
      description: 'Manage recharges and operations',
      icon: Shield,
      path: '/admin',
      color: 'text-blue-500',
    },
    {
      title: 'Student Login',
      description: 'Order food and view menu',
      icon: UserCircle,
      path: '/student',
      color: 'text-primary',
    },
    {
      title: 'Shopper Login',
      description: 'Manage orders and delivery',
      icon: ShoppingBag,
      path: '/shopper',
      color: 'text-secondary',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8 animate-fade-in-up">
        <div className="text-center space-y-4">
          <img 
            src={mecLogo} 
            alt="MEC Logo" 
            className="w-20 h-20 mx-auto"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Login to Madras Kitchen
          </h1>
          <p className="text-muted-foreground">Select your role to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loginOptions.map((option, index) => (
            <Card 
              key={index}
              className="hover:shadow-hover transition-smooth cursor-pointer group"
              onClick={() => navigate(option.path)}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-smooth">
                  <option.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
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

        <div className="text-center pt-8">
          <p className="text-sm text-muted-foreground">
            Powered by Madras Engineering College
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
