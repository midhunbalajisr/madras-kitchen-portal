import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { getCart, clearCart, saveOrder, getCurrentUser, generateToken, type Order } from '@/lib/storage';
import { CreditCard, Smartphone, Wallet, QrCode, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const cart = getCart();
  const currentUser = getCurrentUser();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const paymentMethods = [
    { id: 'card', name: 'Student Card', icon: CreditCard, available: true },
    { id: 'gpay', name: 'Google Pay', icon: Smartphone, available: true },
    { id: 'phonepe', name: 'PhonePe', icon: Smartphone, available: true },
    { id: 'upi', name: 'UPI', icon: QrCode, available: true },
  ];

  const handlePayment = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!currentUser) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    if (paymentMethod === 'card' && currentUser.balance < total) {
      toast.error('Insufficient balance. Please recharge your card.');
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const token = generateToken();
      const order: Order = {
        id: Date.now().toString(),
        studentId: currentUser.id,
        items: cart,
        total,
        paymentMethod,
        status: 'pending',
        token,
        timestamp: Date.now(),
      };

      saveOrder(order);
      
      // Update user balance and points
      if (paymentMethod === 'card') {
        currentUser.balance -= total;
      }
      currentUser.points += 10; // 10 points per order
      
      clearCart();
      setProcessing(false);

      toast.success('Payment successful!', {
        description: `Your order token is ${token}`,
      });

      navigate('/order-success', { state: { token, order } });
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => navigate('/student')}>
              Go to Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background p-4">
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/student')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>{cart.length} items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose your preferred payment option</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                {paymentMethods.map(method => (
                  <div key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label 
                      htmlFor={method.id} 
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <method.icon className="w-5 h-5 text-primary" />
                      <span className="font-medium">{method.name}</span>
                    </Label>
                    {method.id === 'card' && currentUser && (
                      <Badge variant="secondary">
                        Balance: ₹{currentUser.balance}
                      </Badge>
                    )}
                  </div>
                ))}
              </RadioGroup>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  <CheckCircle className="w-4 h-4 inline text-green-500" />
                  {' '}Your food will be ready within 5 minutes
                </p>
                <p className="text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 inline text-green-500" />
                  {' '}You'll receive a token number after payment
                </p>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? 'Processing...' : `Pay ₹${total}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
