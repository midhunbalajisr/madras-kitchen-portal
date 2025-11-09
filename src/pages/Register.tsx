import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateStudentId, saveStudent, type Student } from '@/lib/storage';
import { ArrowLeft, UserPlus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import mecLogo from '@/assets/mec-logo-official.png';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registered, setRegistered] = useState(false);
  const [studentId, setStudentId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      toast.error('Please enter valid email');
      return;
    }

    const newStudentId = generateStudentId();
    const newStudent: Student = {
      id: newStudentId,
      name: name.trim(),
      email: email.trim(),
      balance: 0,
      points: 0,
      orders: [],
    };

    saveStudent(newStudent);
    setStudentId(newStudentId);
    setRegistered(true);
    toast.success('Registration successful!');
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Registration Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">Your Student ID</p>
              <div className="text-5xl font-bold text-primary">{studentId}</div>
              <p className="text-sm text-muted-foreground">
                Please remember this ID for future logins
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Balance</span>
                <span className="font-medium">₹0</span>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
              <p className="text-sm text-center">
                Please visit the admin to recharge your account before ordering
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
              >
                Back to Login
              </Button>
              <Button onClick={() => navigate('/student')}>
                Go to Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background p-4">
      <div className="max-w-2xl mx-auto space-y-6 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/login')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>

        <Card>
          <CardHeader className="text-center space-y-4">
            <img src={mecLogo} alt="MEC Logo" className="w-20 h-20 mx-auto" />
            <CardTitle className="text-3xl">Student Registration</CardTitle>
            <CardDescription className="text-base">
              Create your account to start ordering from Madras Kitchen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@mec.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-semibold">📝 Note:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• A unique Student ID will be generated automatically</li>
                  <li>• Initial balance will be ₹0</li>
                  <li>• Visit admin to recharge your account</li>
                  <li>• Earn 10 points with every order</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <UserPlus className="w-4 h-4 mr-2" />
                Register Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
