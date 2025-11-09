import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { saveComplaint, getCurrentUser, type Complaint } from '@/lib/storage';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const ComplaintPage = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [name, setName] = useState(currentUser?.name || '');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    const complaint: Complaint = {
      id: Date.now().toString(),
      studentId: currentUser?.id || 'guest',
      name: name.trim(),
      description: description.trim(),
      timestamp: Date.now(),
      status: 'pending',
    };

    saveComplaint(complaint);
    toast.success('Complaint submitted successfully!');
    setDescription('');
    setTimeout(() => navigate('/student'), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background p-4">
      <div className="max-w-2xl mx-auto space-y-6 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/student')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Submit Complaint</CardTitle>
            <CardDescription>
              Let us know about any issues or concerns you have
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Describe Your Issue</Label>
                <Textarea
                  id="description"
                  placeholder="Please describe your complaint in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-semibold mb-2">Canteen Rush Status</p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Moderate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Rush</span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <AlertCircle className="w-4 h-4 mr-2" />
                Submit Complaint
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-4">
            <p className="text-sm text-center">
              <CheckCircle className="w-4 h-4 inline text-green-500 mr-2" />
              Your complaint will be reviewed by the admin team
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComplaintPage;
