import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  History, 
  Gift, 
  Settings, 
  ArrowLeft, 
  Package, 
  Clock, 
  CheckCircle2, 
  ChefHat,
  Truck,
  Star,
  Wallet,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { getCurrentUser, getOrders, saveStudent, Order, Student } from '@/lib/storage';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Student | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setEditedName(currentUser.name);
    setEditedEmail(currentUser.email);
    
    const allOrders = getOrders();
    const userOrders = allOrders.filter(o => o.studentId === currentUser.id);
    setOrders(userOrders);
  }, [navigate]);

  const handleSaveProfile = () => {
    if (user) {
      const updatedUser = { ...user, name: editedName, email: editedEmail };
      saveStudent(updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'preparing': return <ChefHat className="w-4 h-4" />;
      case 'ready': return <Package className="w-4 h-4" />;
      case 'delivered': return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 text-amber-600 border-amber-500/30';
      case 'preparing': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'ready': return 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30';
      case 'delivered': return 'bg-teal-500/20 text-teal-600 border-teal-500/30';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/student')}
            className="text-white hover:bg-white/20 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-white/80">{user.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-white/90 backdrop-blur border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Wallet className="w-6 h-6 mx-auto text-teal-600 mb-2" />
              <p className="text-2xl font-bold text-teal-700">₹{user.balance}</p>
              <p className="text-xs text-muted-foreground">Balance</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 mx-auto text-amber-500 mb-2" />
              <p className="text-2xl font-bold text-amber-600">{user.points}</p>
              <p className="text-xs text-muted-foreground">Points</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Package className="w-6 h-6 mx-auto text-cyan-600 mb-2" />
              <p className="text-2xl font-bold text-cyan-700">{orders.length}</p>
              <p className="text-xs text-muted-foreground">Orders</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur">
            <TabsTrigger value="orders" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              <History className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              <Gift className="w-4 h-4 mr-2" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-4 space-y-4">
            {orders.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur border-0">
                <CardContent className="p-8 text-center">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No orders yet</p>
                  <Button 
                    onClick={() => navigate('/student')} 
                    className="mt-4 bg-teal-600 hover:bg-teal-700"
                  >
                    Start Ordering
                  </Button>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="bg-white/80 backdrop-blur border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-teal-800">Token #{order.token}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.timestamp)}</p>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} border`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span className="text-muted-foreground">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="font-medium">Total</span>
                      <span className="font-bold text-teal-700">₹{order.total}</span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-3 border-teal-200 text-teal-700 hover:bg-teal-50"
                      onClick={() => navigate(`/order-tracking/${order.id}`)}
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Track Order
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="mt-4">
            <Card className="bg-white/80 backdrop-blur border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-800">
                  <Gift className="w-5 h-5" />
                  Your Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Points Balance</span>
                    <span className="text-2xl font-bold text-amber-600">{user.points}</span>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full transition-all" 
                      style={{ width: `${Math.min((user.points / 100) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-amber-700 mt-2">
                    {100 - user.points > 0 ? `${100 - user.points} more points for ₹50 off!` : 'You have a reward available!'}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-muted-foreground">Available Rewards</h4>
                  
                  <div className={`p-4 rounded-lg border-2 ${user.points >= 50 ? 'border-teal-300 bg-teal-50' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">₹25 Off</p>
                        <p className="text-sm text-muted-foreground">50 points required</p>
                      </div>
                      <Button 
                        size="sm" 
                        disabled={user.points < 50}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        Redeem
                      </Button>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border-2 ${user.points >= 100 ? 'border-teal-300 bg-teal-50' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">₹50 Off</p>
                        <p className="text-sm text-muted-foreground">100 points required</p>
                      </div>
                      <Button 
                        size="sm" 
                        disabled={user.points < 100}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        Redeem
                      </Button>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border-2 ${user.points >= 200 ? 'border-teal-300 bg-teal-50' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Free Meal</p>
                        <p className="text-sm text-muted-foreground">200 points required</p>
                      </div>
                      <Button 
                        size="sm" 
                        disabled={user.points < 200}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        Redeem
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-4">
            <Card className="bg-white/80 backdrop-blur border-0 shadow-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-teal-800">
                    <Settings className="w-5 h-5" />
                    Account Settings
                  </CardTitle>
                  {!isEditing ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="border-teal-200 text-teal-700"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedName(user.name);
                          setEditedEmail(user.email);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleSaveProfile}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Student ID</Label>
                  <Input value={user.id} disabled className="bg-gray-100" />
                </div>
                
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input 
                    value={editedName} 
                    onChange={(e) => setEditedName(e.target.value)}
                    disabled={!isEditing}
                    className={isEditing ? 'border-teal-300' : 'bg-gray-100'}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    value={editedEmail} 
                    onChange={(e) => setEditedEmail(e.target.value)}
                    disabled={!isEditing}
                    className={isEditing ? 'border-teal-300' : 'bg-gray-100'}
                  />
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => {
                      navigate('/');
                      toast.success('Logged out successfully');
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
