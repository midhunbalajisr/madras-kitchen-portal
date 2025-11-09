import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { saveFeedback, getCurrentUser, generateToken, type Feedback } from '@/lib/storage';
import { ArrowLeft, Star, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedbackToken, setFeedbackToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please add your feedback');
      return;
    }

    const token = generateToken();
    const respondents = ['Admin', 'Canteener']; // Two members as requested

    const feedback: Feedback = {
      id: Date.now().toString(),
      studentId: currentUser?.id || 'guest',
      rating,
      comment: comment.trim(),
      token,
      timestamp: Date.now(),
      respondents,
    };

    saveFeedback(feedback);
    setFeedbackToken(token);
    setSubmitted(true);
    toast.success('Thank you for your feedback!');
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Feedback Submitted!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">Your Feedback Token</p>
              <div className="text-5xl font-bold text-primary">{feedbackToken}</div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-semibold">Respondents:</p>
              <div className="flex gap-2">
                <Badge variant="secondary">Admin</Badge>
                <Badge variant="secondary">Canteener</Badge>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
              <p className="text-sm text-center">
                Thank you for helping us improve! Your feedback will be reviewed by our team.
              </p>
            </div>

            <Button 
              className="w-full"
              onClick={() => navigate('/student')}
            >
              Back to Menu
            </Button>
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
          onClick={() => navigate('/student')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Give Feedback</CardTitle>
            <CardDescription>
              Help us improve by sharing your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Rate Your Experience</p>
                <div className="flex gap-2 justify-center py-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-12 h-12 ${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-sm text-muted-foreground">
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Your Feedback</p>
                <Textarea
                  placeholder="Tell us about your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 inline text-green-500 mr-2" />
                  Your feedback will be reviewed by Admin and Canteener
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackPage;
