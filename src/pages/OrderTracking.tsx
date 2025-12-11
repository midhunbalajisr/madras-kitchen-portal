import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Clock, 
  ChefHat, 
  Package, 
  CheckCircle2,
  MapPin,
  Phone,
  RefreshCw
} from 'lucide-react';
import { getOrders, Order, getCurrentUser } from '@/lib/storage';

const OrderTracking = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    loadOrder();
  }, [orderId, navigate]);

  const loadOrder = () => {
    const orders = getOrders();
    const foundOrder = orders.find(o => o.id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      loadOrder();
      setIsRefreshing(false);
    }, 1000);
  };

  const steps = [
    { key: 'pending', label: 'Order Placed', icon: Clock, description: 'Your order has been received' },
    { key: 'preparing', label: 'Preparing', icon: ChefHat, description: 'Chef is preparing your food' },
    { key: 'ready', label: 'Ready', icon: Package, description: 'Order is ready for pickup' },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2, description: 'Enjoy your meal!' },
  ];

  const getStepIndex = (status: Order['status']) => {
    return steps.findIndex(s => s.key === status);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
        <Card className="bg-white/90 backdrop-blur">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-4">We couldn't find this order.</p>
            <Button onClick={() => navigate('/student')} className="bg-indigo-600 hover:bg-indigo-700">
              Back to Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStepIndex = getStepIndex(order.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/profile')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              variant="ghost"
              onClick={handleRefresh}
              className="text-white hover:bg-white/20"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1">Track Your Order</h1>
            <p className="text-white/80">Token #{order.token}</p>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="max-w-2xl mx-auto px-4 -mt-4">
        <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="relative">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div key={step.key} className="flex items-start mb-8 last:mb-0">
                    {/* Line */}
                    {index < steps.length - 1 && (
                      <div 
                        className={`absolute left-6 w-0.5 h-16 mt-12 -translate-x-1/2 ${
                          index < currentStepIndex ? 'bg-gradient-to-b from-indigo-500 to-purple-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                    
                    {/* Icon */}
                    <div 
                      className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isCompleted 
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-purple-200 scale-110' : ''}`}
                    >
                      <StepIcon className="w-5 h-5" />
                    </div>
                    
                    {/* Content */}
                    <div className="ml-4 flex-1">
                      <h3 className={`font-semibold ${isCompleted ? 'text-indigo-700' : 'text-gray-400'}`}>
                        {step.label}
                      </h3>
                      <p className={`text-sm ${isCompleted ? 'text-muted-foreground' : 'text-gray-300'}`}>
                        {step.description}
                      </p>
                      {isCurrent && (
                        <span className="inline-block mt-2 text-xs bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1 rounded-full">
                          Current Status
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Details */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <Card className="bg-white/90 backdrop-blur border-0 shadow-md">
          <CardContent className="p-4">
            <h3 className="font-semibold text-indigo-800 mb-3">Order Details</h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-xl font-bold text-indigo-700">₹{order.total}</span>
            </div>
          </CardContent>
        </Card>

        {/* Pickup Info */}
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Pickup Location</h3>
            <div className="flex items-start gap-3 mb-3">
              <MapPin className="w-5 h-5 mt-0.5" />
              <div>
                <p className="font-medium">Madras Kitchen Counter</p>
                <p className="text-white/80 text-sm">Ground Floor, MEC Campus</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5" />
              <p className="text-sm">Support: 7002080020</p>
            </div>
          </CardContent>
        </Card>

        {/* Order Info */}
        <Card className="bg-white/90 backdrop-blur border-0 shadow-md">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Order ID</p>
                <p className="font-medium">{order.id.slice(0, 8)}...</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment</p>
                <p className="font-medium capitalize">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Ordered At</p>
                <p className="font-medium">{formatDate(order.timestamp)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Est. Ready</p>
                <p className="font-medium">15-20 mins</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderTracking;
