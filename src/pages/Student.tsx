import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { menuItems, categories, getDayOffer, type MenuItem } from '@/data/menuData';
import { FoodCard } from '@/components/FoodCard';
import { Cart } from '@/components/Cart';
import { LogOut, Star, Gift, Clock, Wallet, Sparkles, ArrowLeft, MessageSquare, AlertTriangle } from 'lucide-react';
import { getCurrentUser, setCurrentUser as saveCurrentUser, getStudents } from '@/lib/storage';
import { dispatchCartUpdate } from '@/hooks/useCart';
import { addToCart as addToCartStorage } from '@/lib/storage';
import { toast } from 'sonner';
import mecLogo from '@/assets/mec-logo-official.png';

const Student = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('veg');
  const [currentUser, setUser] = useState(getCurrentUser());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!currentUser) {
      const students = getStudents();
      if (students.length > 0) {
        saveCurrentUser(students[0]);
        setUser(students[0]);
      }
    }

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const handleAddToCart = (item: MenuItem, quantity: number) => {
    addToCartStorage({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity,
      image: item.image,
      category: item.category,
    });
    dispatchCartUpdate();
    toast.success(`${item.name} added to cart!`, {
      description: 'View cart to checkout',
    });
  };

  const filteredItems = menuItems.filter(item => item.category === selectedCategory);
  const todayOffer = getDayOffer();

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-GB') + ' ' + date.toLocaleTimeString('en-US');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 pb-24">
      {/* Sticky Header */}
      <nav className="bg-background/80 backdrop-blur-xl shadow-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/login')} className="hover:bg-primary/10">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <img src={mecLogo} alt="MEC Logo" className="w-10 h-10 rounded-full shadow-lg" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Madras Kitchen
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDateTime(currentTime)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentUser && (
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-sm">{currentUser.name}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="bg-primary/10 border-primary/30">
                      <Wallet className="w-3 h-3 mr-1" />
                      ₹{currentUser.balance}
                    </Badge>
                    <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {currentUser.points}
                    </Badge>
                  </div>
                </div>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  saveCurrentUser(null);
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
        {/* Today's Offer Banner */}
        {todayOffer && (
          <Card className="bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground border-0 shadow-hover overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9nPjwvc3ZnPg==')] opacity-30" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center animate-bounce-in">
                    <Gift className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl flex items-center gap-2">
                      {todayOffer.title}
                      <Sparkles className="w-5 h-5" />
                    </h3>
                    <p className="text-white/90">{todayOffer.description}</p>
                  </div>
                </div>
                <Badge className="bg-white text-primary hover:bg-white text-xl px-6 py-3 font-bold shadow-lg">
                  {todayOffer.discount}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Card className="flex-1 min-w-[200px] border-0 shadow-card bg-gradient-to-br from-amber-500/10 to-orange-500/10">
            <CardContent className="p-4 flex items-center gap-3">
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              <div>
                <p className="text-xs text-muted-foreground">Loyalty Program</p>
                <p className="font-semibold text-sm">10 pts/order • 100 pts = ₹50</p>
              </div>
            </CardContent>
          </Card>
          <Button 
            variant="outline" 
            className="border-2 hover:bg-primary/10"
            onClick={() => navigate('/feedback')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Feedback
          </Button>
          <Button 
            variant="outline" 
            className="border-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
            onClick={() => navigate('/complaint')}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Complaint
          </Button>
        </div>

        {/* Menu Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full flex flex-wrap justify-start gap-2 h-auto bg-transparent p-0">
            {categories.map(cat => (
              <TabsTrigger 
                key={cat.id} 
                value={cat.id} 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white px-4 py-2 rounded-full border-2 data-[state=inactive]:border-border data-[state=active]:border-transparent transition-all"
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(cat => (
            <TabsContent key={cat.id} value={cat.id} className="mt-6">
              <div className="mb-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <span className="text-4xl">{cat.icon}</span>
                  <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {cat.name}
                  </span>
                  <Badge variant="secondary" className="text-sm">{filteredItems.length} dishes</Badge>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item, index) => (
                  <div key={item.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 50}ms` }}>
                    <FoodCard 
                      item={item}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
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
