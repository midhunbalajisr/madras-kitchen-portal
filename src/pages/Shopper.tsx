import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getOrders, updateOrderStatus, type Order } from '@/lib/storage';
import { LogOut, Package, Truck, CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import mecLogo from '@/assets/mec-logo-official.png';

const Shopper = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setOrders(getOrders());
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(`Order ${orderId.slice(-4)} marked as ${newStatus}`);
    loadOrders();
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'preparing': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      case 'delivered': return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return Package;
      case 'preparing': return Package;
      case 'ready': return CheckCircle;
      case 'delivered': return Truck;
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');

  const OrderCard = ({ order }: { order: Order }) => {
    const StatusIcon = getStatusIcon(order.status);
    
    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Token: {order.token}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Order ID: {order.id.slice(-8)}
              </p>
            </div>
            <Badge className={getStatusColor(order.status)}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary">₹{order.total}</span>
          </div>
          <div className="flex gap-2">
            {order.status === 'pending' && (
              <Button 
                onClick={() => handleStatusUpdate(order.id, 'preparing')}
                className="flex-1"
              >
                Start Preparing
              </Button>
            )}
            {order.status === 'preparing' && (
              <Button 
                onClick={() => handleStatusUpdate(order.id, 'ready')}
                className="flex-1"
              >
                Mark as Ready
              </Button>
            )}
            {order.status === 'ready' && (
              <Button 
                onClick={() => handleStatusUpdate(order.id, 'delivered')}
                variant="secondary"
                className="flex-1"
              >
                Mark as Delivered
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Ordered: {new Date(order.timestamp).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <nav className="bg-card shadow-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/login')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <img src={mecLogo} alt="MEC Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-foreground">Canteener Panel</h1>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/login')}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-500">{pendingOrders.length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-500">{preparingOrders.length}</p>
              <p className="text-sm text-muted-foreground">Preparing</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-500">{readyOrders.length}</p>
              <p className="text-sm text-muted-foreground">Ready</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-500">{deliveredOrders.length}</p>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">
              Pending ({pendingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="preparing">
              Preparing ({preparingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="ready">
              Ready ({readyOrders.length})
            </TabsTrigger>
            <TabsTrigger value="delivered">
              Delivered ({deliveredOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pendingOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  No pending orders
                </CardContent>
              </Card>
            ) : (
              pendingOrders.map(order => <OrderCard key={order.id} order={order} />)
            )}
          </TabsContent>

          <TabsContent value="preparing" className="mt-6">
            {preparingOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  No orders being prepared
                </CardContent>
              </Card>
            ) : (
              preparingOrders.map(order => <OrderCard key={order.id} order={order} />)
            )}
          </TabsContent>

          <TabsContent value="ready" className="mt-6">
            {readyOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  No orders ready for pickup
                </CardContent>
              </Card>
            ) : (
              readyOrders.map(order => <OrderCard key={order.id} order={order} />)
            )}
          </TabsContent>

          <TabsContent value="delivered" className="mt-6">
            {deliveredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  No delivered orders
                </CardContent>
              </Card>
            ) : (
              deliveredOrders.map(order => <OrderCard key={order.id} order={order} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Shopper;
