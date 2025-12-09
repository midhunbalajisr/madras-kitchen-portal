import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Trash2, Sparkles } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';

export const Cart = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { cart, total, itemCount, updateQuantity, removeItem, isLoading } = useCart();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setOpen(false);
    navigate('/payment');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="default" 
          size="lg" 
          className="fixed bottom-6 right-6 rounded-full shadow-hover z-50 bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform animate-bounce-in"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Cart
          {itemCount > 0 && (
            <Badge className="ml-2 bg-background text-foreground animate-bounce-in">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-gradient-to-b from-background to-muted/30">
        <SheetHeader>
          <SheetTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Your Cart
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-2">Add some delicious items!</p>
            </div>
          ) : (
            <>
              {cart.map((item, index) => (
                <div 
                  key={item.id} 
                  className="flex gap-4 p-4 bg-card border border-border rounded-xl shadow-card hover:shadow-hover transition-all"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <p className="text-primary font-bold mt-1">₹{item.price}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 hover:bg-destructive/10"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {cart.length > 0 && (
          <SheetFooter className="mt-6">
            <div className="w-full space-y-4">
              <div className="bg-primary/10 rounded-xl p-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">₹{total}</span>
                </div>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90" 
                size="lg"
                onClick={handleCheckout}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Proceed to Checkout
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
