import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getOrders, updateOrderStatus, type Order } from '@/lib/storage';
import { 
  LogOut, 
  Package, 
  Truck, 
  CheckCircle, 
  ArrowLeft, 
  RefreshCw, 
  Clock,
  ChefHat,
  Bell,
  Search,
  TrendingUp,
  IndianRupee,
  Users,
  Timer,
  Sparkles,
  CreditCard,
  Volume2,
  VolumeX
} from 'lucide-react';
import { toast } from 'sonner';
import mecLogo from '@/assets/mec-logo-official.png';
import { supabase } from '@/integrations/supabase/client';

const Shopper = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  const loadOrders = useCallback(() => {
    const allOrders = getOrders();
    setOrders(allOrders);
    
    // Play sound for new orders
    if (soundEnabled && allOrders.length > lastOrderCount && lastOrderCount > 0) {
      playNotificationSound();
      toast.success('🔔 New order received!', {
        description: 'Check pending orders',
      });
    }
    setLastOrderCount(allOrders.length);
  }, [soundEnabled, lastOrderCount]);

  useEffect(() => {
    loadOrders();
    
    // Poll for new orders every 5 seconds
    const pollInterval = setInterval(loadOrders, 5000);
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(timeInterval);
    };
  }, [loadOrders]);

  const playNotificationSound = () => {
    // Create a simple beep using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 200);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      loadOrders();
      setIsRefreshing(false);
      toast.success('Orders refreshed');
    }, 500);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(`Order marked as ${newStatus}`, {
      description: `Token: ${orders.find(o => o.id === orderId)?.token}`,
    });
    loadOrders();
  };

  const verifyPayment = async (order: Order) => {
    if (!order.cashfreeOrderId) {
      toast.error('No Cashfree order ID found');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('cashfree-payment', {
        body: {
          action: 'verify_payment',
          orderId: order.cashfreeOrderId,
        },
      });

      if (error) throw error;

      if (data.success) {
        toast.success('Payment verified!', {
          description: `Status: ${data.status}`,
        });
      } else {
        toast.warning('Payment pending', {
          description: data.status || 'Awaiting payment',
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error('Failed to verify payment');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-500';
      case 'preparing': return 'bg-blue-500';
      case 'ready': return 'bg-emerald-500';
      case 'delivered': return 'bg-slate-500';
    }
  };

  const getStatusBgColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'from-amber-500/10 to-orange-500/10 border-amber-200';
      case 'preparing': return 'from-blue-500/10 to-indigo-500/10 border-blue-200';
      case 'ready': return 'from-emerald-500/10 to-teal-500/10 border-emerald-200';
      case 'delivered': return 'from-slate-500/10 to-gray-500/10 border-slate-200';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'preparing': return ChefHat;
      case 'ready': return Package;
      case 'delivered': return Truck;
    }
  };

  const filteredOrders = orders.filter(order => 
    order.token.includes(searchQuery) || 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pendingOrders = filteredOrders.filter(o => o.status === 'pending');
  const preparingOrders = filteredOrders.filter(o => o.status === 'preparing');
  const readyOrders = filteredOrders.filter(o => o.status === 'ready');
  const deliveredOrders = filteredOrders.filter(o => o.status === 'delivered');

  const todayOrders = orders.filter(o => {
    const today = new Date();
    const orderDate = new Date(o.timestamp);
    return orderDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = todayOrders.length > 0 ? Math.round(todayRevenue / todayOrders.length) : 0;

  const getTimeSince = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m ago`;
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const StatusIcon = getStatusIcon(order.status);
    const timeSince = getTimeSince(order.timestamp);
    
    return (
      <Card className={`bg-gradient-to-br ${getStatusBgColor(order.status)} border-2 shadow-lg hover:shadow-xl transition-all duration-300`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${getStatusColor(order.status)} flex items-center justify-center shadow-lg`}>
                <span className="text-white font-bold text-lg">{order.token.slice(-2)}</span>
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Token #{order.token}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Timer className="w-3 h-3" />
                  {timeSince}
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge className={`${getStatusColor(order.status)} text-white`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {order.paymentMethod.toUpperCase()}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/50 rounded-lg p-3 space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                  <span className="font-medium">{item.name}</span>
                  <Badge variant="outline" className="text-xs">x{item.quantity}</Badge>
                </div>
                <span className="font-semibold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t-2 border-dashed">
            <span className="font-semibold text-lg">Total</span>
            <span className="text-2xl font-bold text-violet-700">₹{order.total}</span>
          </div>

          {order.cashfreeOrderId && (
            <div className="flex items-center justify-between bg-violet-100 rounded-lg p-2">
              <div className="flex items-center gap-2 text-sm text-violet-700">
                <CreditCard className="w-4 h-4" />
                <span>Cashfree: {order.cashfreeOrderId.slice(0, 10)}...</span>
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                className="text-violet-700 hover:bg-violet-200"
                onClick={() => verifyPayment(order)}
              >
                Verify
              </Button>
            </div>
          )}
          
          <div className="flex gap-2">
            {order.status === 'pending' && (
              <Button 
                onClick={() => handleStatusUpdate(order.id, 'preparing')}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 h-12 font-semibold"
              >
                <ChefHat className="w-4 h-4 mr-2" />
                Start Preparing
              </Button>
            )}
            {order.status === 'preparing' && (
              <Button 
                onClick={() => handleStatusUpdate(order.id, 'ready')}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 h-12 font-semibold"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Ready
              </Button>
            )}
            {order.status === 'ready' && (
              <Button 
                onClick={() => handleStatusUpdate(order.id, 'delivered')}
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 hover:opacity-90 h-12 font-semibold"
              >
                <Truck className="w-4 h-4 mr-2" />
                Hand Over
              </Button>
            )}
            {order.status === 'delivered' && (
              <div className="flex-1 text-center py-3 text-emerald-600 font-semibold flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Order Completed
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* Header */}
      <nav className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/login')}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <img src={mecLogo} alt="MEC Logo" className="w-12 h-12 rounded-full border-2 border-white/30" />
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Canteener Dashboard
                </h1>
                <p className="text-white/80 text-sm flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  <span className="mx-2">•</span>
                  Live Orders
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-white hover:bg-white/20"
                title={soundEnabled ? 'Mute notifications' : 'Enable notifications'}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>
              <Button 
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-white hover:bg-white/20"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <div className="relative">
                <Bell className="w-6 h-6" />
                {pendingOrders.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 text-violet-900 rounded-full text-xs flex items-center justify-center font-bold animate-pulse">
                    {pendingOrders.length}
                  </span>
                )}
              </div>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-amber-100 to-orange-100 border-amber-200 border-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-700 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-amber-600">{pendingOrders.length}</p>
                </div>
                <Clock className="w-10 h-10 text-amber-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-200 border-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 text-sm font-medium">Preparing</p>
                  <p className="text-3xl font-bold text-blue-600">{preparingOrders.length}</p>
                </div>
                <ChefHat className="w-10 h-10 text-blue-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-200 border-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-700 text-sm font-medium">Ready</p>
                  <p className="text-3xl font-bold text-emerald-600">{readyOrders.length}</p>
                </div>
                <Package className="w-10 h-10 text-emerald-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-violet-100 to-purple-100 border-violet-200 border-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-700 text-sm font-medium">Today's Revenue</p>
                  <p className="text-3xl font-bold text-violet-600">₹{todayRevenue}</p>
                </div>
                <IndianRupee className="w-10 h-10 text-violet-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-pink-100 to-rose-100 border-pink-200 border-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-700 text-sm font-medium">Avg Order</p>
                  <p className="text-3xl font-bold text-pink-600">₹{avgOrderValue}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-pink-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by token, order ID, or item name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-lg border-2 border-violet-200 focus:border-violet-500 bg-white/80"
          />
        </div>

        {/* Orders Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-14 bg-white/80 backdrop-blur">
            <TabsTrigger 
              value="pending" 
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-white text-base"
            >
              <Clock className="w-4 h-4 mr-2" />
              Pending ({pendingOrders.length})
            </TabsTrigger>
            <TabsTrigger 
              value="preparing"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-base"
            >
              <ChefHat className="w-4 h-4 mr-2" />
              Cooking ({preparingOrders.length})
            </TabsTrigger>
            <TabsTrigger 
              value="ready"
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-base"
            >
              <Package className="w-4 h-4 mr-2" />
              Ready ({readyOrders.length})
            </TabsTrigger>
            <TabsTrigger 
              value="delivered"
              className="data-[state=active]:bg-slate-500 data-[state=active]:text-white text-base"
            >
              <Truck className="w-4 h-4 mr-2" />
              Done ({deliveredOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pendingOrders.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur">
                <CardContent className="p-12 text-center">
                  <Clock className="w-16 h-16 mx-auto text-amber-300 mb-4" />
                  <p className="text-xl font-medium text-muted-foreground">No pending orders</p>
                  <p className="text-sm text-muted-foreground mt-2">New orders will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingOrders.map(order => <OrderCard key={order.id} order={order} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="preparing" className="mt-6">
            {preparingOrders.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur">
                <CardContent className="p-12 text-center">
                  <ChefHat className="w-16 h-16 mx-auto text-blue-300 mb-4" />
                  <p className="text-xl font-medium text-muted-foreground">No orders cooking</p>
                  <p className="text-sm text-muted-foreground mt-2">Start preparing pending orders</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {preparingOrders.map(order => <OrderCard key={order.id} order={order} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ready" className="mt-6">
            {readyOrders.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur">
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto text-emerald-300 mb-4" />
                  <p className="text-xl font-medium text-muted-foreground">No orders ready</p>
                  <p className="text-sm text-muted-foreground mt-2">Ready orders will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {readyOrders.map(order => <OrderCard key={order.id} order={order} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="delivered" className="mt-6">
            {deliveredOrders.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur">
                <CardContent className="p-12 text-center">
                  <Truck className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                  <p className="text-xl font-medium text-muted-foreground">No completed orders today</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deliveredOrders.map(order => <OrderCard key={order.id} order={order} />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Shopper;
