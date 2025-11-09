import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { menuItems, categories, getDayOffer, type MenuItem } from '@/data/menuData';
import { FoodCard } from '@/components/FoodCard';
import { Cart } from '@/components/Cart';
import { LogOut, Star, Gift, Clock, Wallet } from 'lucide-react';
import { addToCart, getCurrentUser, setCurrentUser, getStudents } from '@/lib/storage';
import { toast } from 'sonner';
import mecLogo from '@/assets/mec-logo.png';

const Student = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('veg');
  const [currentUser, setUser] = useState(getCurrentUser());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // If no user logged in, use first demo student
    if (!currentUser) {
      const students = getStudents();
      if (students.length > 0) {
        setCurrentUser(students[0]);
        setUser(students[0]);
      }
    }

    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (item: MenuItem, quantity: number) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity,
      image: item.image,
      category: item.category,
    });
    toast.success(`${item.name} added to cart!`);
  };

  const filteredItems = menuItems.filter(item => item.category === selectedCategory);
  const todayOffer = getDayOffer();

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-GB') + ' ' + date.toLocaleTimeString('en-US');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background pb-24">
      <nav className="bg-card shadow-card border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={mecLogo} alt="MEC Logo" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Madras Kitchen</h1>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {formatDateTime(currentTime)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {currentUser && (
                <div className="text-right hidden sm:block">
                  <p className="font-semibold">{currentUser.name}</p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-primary font-bold flex items-center gap-1">
                      <Wallet className="w-3 h-3" />
                      ₹{currentUser.balance}
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {currentUser.points} pts
                    </span>
                  </div>
                </div>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setCurrentUser(null);
                  navigate('/login');
                }}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Today's Offer */}
        {todayOffer && (
          <Card className="bg-gradient-primary text-white border-0 shadow-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Gift className="w-8 h-8" />
                  <div>
                    <h3 className="font-bold text-xl">{todayOffer.title}</h3>
                    <p className="text-white/90">{todayOffer.description}</p>
                  </div>
                </div>
                <Badge className="bg-white text-primary hover:bg-white text-lg px-4 py-2">
                  {todayOffer.discount}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Coupon System Info */}
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <Star className="w-4 h-4 inline text-yellow-400 fill-yellow-400" />
                {' '}Earn 10 points per order • 100 points = ₹50 worth food
              </p>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/feedback')}
              >
                Give Feedback
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Menu Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            {categories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id} className="gap-1">
                <span>{cat.icon}</span>
                <span className="hidden sm:inline">{cat.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(cat => (
            <TabsContent key={cat.id} value={cat.id}>
              <div className="mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <span>{cat.icon}</span>
                  {cat.name} Items
                  <Badge variant="secondary">{filteredItems.length} dishes</Badge>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map(item => (
                  <FoodCard 
                    key={item.id} 
                    item={item}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Cart />
    </div>
  );
};

export default Student;
