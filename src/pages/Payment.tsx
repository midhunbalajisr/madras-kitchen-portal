import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getCart, clearCart, saveOrder, getCurrentUser, generateToken, type Order } from '@/lib/storage';
import { CreditCard, Smartphone, QrCode, CheckCircle, ArrowLeft, Shield, Zap, Gift, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import mecLogo from '@/assets/mec-logo-official.png';

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');
  const cart = getCart();
  const currentUser = getCurrentUser();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = Math.round(total * 0.05);
  const grandTotal = total + gst;

  const paymentMethods = [
    { id: 'upi', name: 'UPI Payment', icon: QrCode, description: 'Pay via any UPI app', color: 'from-violet-500 to-purple-600' },
    { id: 'gpay', name: 'Google Pay', icon: Smartphone, description: 'Fast & secure', color: 'from-blue-500 to-cyan-500' },
    { id: 'phonepe', name: 'PhonePe', icon: Smartphone, description: 'Instant payment', color: 'from-purple-600 to-indigo-600' },
    { id: 'card', name: 'Student Card', icon: CreditCard, description: 'Use your balance', color: 'from-amber-500 to-orange-500' },
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

    if (paymentMethod === 'card' && currentUser.balance < grandTotal) {
      toast.error('Insufficient balance. Please recharge your card.');
      return;
    }

    if ((paymentMethod === 'upi' || paymentMethod === 'gpay' || paymentMethod === 'phonepe') && !upiId) {
      toast.error('Please enter your UPI ID');
      return;
    }

    setProcessing(true);

    // Simulate Cashfree payment processing
    setTimeout(() => {
      const token = generateToken();
      const order: Order = {
        id: `CF${Date.now()}`,
        studentId: currentUser.id,
        items: cart,
        total: grandTotal,
        paymentMethod,
        status: 'pending',
        token,
        timestamp: Date.now(),
      };

      saveOrder(order);
      
      if (paymentMethod === 'card') {
        currentUser.balance -= grandTotal;
      }
      currentUser.points += Math.floor(grandTotal / 10);
      
      clearCart();
      setProcessing(false);

      toast.success('Payment successful!', {
        description: `Order token: ${token}`,
      });

      navigate('/order-success', { state: { token, order } });
    }, 2500);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-0 shadow-card">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-6">Your cart is empty</p>
            <Button onClick={() => navigate('/student')} className="bg-gradient-to-r from-primary to-secondary">
              <Sparkles className="w-4 h-4 mr-2" />
              Browse Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/student')}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <img src={mecLogo} alt="MEC Logo" className="w-10 h-10 rounded-full" />
            <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Secure Checkout
            </span>
          </div>
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
            <Shield className="w-3 h-3 mr-1" />
            Secured
          </Badge>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-0 shadow-card overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Payment Method
                </CardTitle>
                <CardDescription>Choose your preferred payment option</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  {paymentMethods.map(method => (
                    <div 
                      key={method.id} 
                      className={`relative flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === method.id 
                          ? 'border-primary bg-primary/5 shadow-lg' 
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center shadow-lg`}>
                        <method.icon className="w-6 h-6 text-white" />
                      </div>
                      <Label 
                        htmlFor={method.id} 
                        className="flex-1 cursor-pointer"
                      >
                        <span className="font-semibold block">{method.name}</span>
                        <span className="text-sm text-muted-foreground">{method.description}</span>
                      </Label>
                      {method.id === 'card' && currentUser && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                          ₹{currentUser.balance}
                        </Badge>
                      )}
                      {paymentMethod === method.id && (
                        <CheckCircle className="w-5 h-5 text-primary absolute right-4" />
                      )}
                    </div>
                  ))}
                </RadioGroup>

                {/* UPI Input */}
                {(paymentMethod === 'upi' || paymentMethod === 'gpay' || paymentMethod === 'phonepe') && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-xl space-y-3 animate-fadeInUp">
                    <Label htmlFor="upi" className="font-semibold">Enter UPI ID</Label>
                    <Input 
                      id="upi"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="border-2 focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground">Example: name@okicici, name@ybl, name@paytm</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Instant Confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-primary" />
                <span>Earn Points</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-card sticky top-24">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Order Summary
                </CardTitle>
                <CardDescription>{cart.length} items in cart</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="max-h-64 overflow-y-auto space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-primary">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (5%)</span>
                    <span>₹{gst}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Grand Total</span>
                    <span className="text-primary">₹{grandTotal}</span>
                  </div>
                </div>

                <div className="bg-green-500/10 p-3 rounded-lg flex items-center gap-2 text-sm text-green-700">
                  <Gift className="w-4 h-4" />
                  <span>You'll earn <strong>{Math.floor(grandTotal / 10)} points</strong> on this order!</span>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-14 text-lg font-bold shadow-lg" 
                  onClick={handlePayment}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Pay ₹{grandTotal}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By paying, you agree to our terms of service
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
