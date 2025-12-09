import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ShoppingBag, Flame } from 'lucide-react';
import { type MenuItem } from '@/data/menuData';
import { useCart, dispatchCartUpdate } from '@/hooks/useCart';
import { addToCart as addToCartStorage } from '@/lib/storage';
import { toast } from 'sonner';

interface FoodCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem, quantity: number) => void;
}

export const FoodCard = ({ item, onAddToCart }: FoodCardProps) => {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(item, 1);
    } else {
      addToCartStorage({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
        category: item.category,
      });
      dispatchCartUpdate();
      toast.success(`${item.name} added to cart!`);
    }
  };

  return (
    <Card className="overflow-hidden border-0 shadow-card hover:shadow-hover transition-all duration-300 group bg-card">
      <div className="relative h-44 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <Badge className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-sm">
          {item.category}
        </Badge>
        
        {/* Popular Badge */}
        {item.price > 100 && (
          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
            <Flame className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        )}
        
        {!item.available && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
            <Badge variant="destructive" className="text-lg px-4 py-2">Out of Stock</Badge>
          </div>
        )}
        
        {/* Price Tag */}
        <div className="absolute bottom-3 right-3 bg-primary text-primary-foreground font-bold px-3 py-1 rounded-full text-lg shadow-lg">
          ₹{item.price}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity group/btn"
          disabled={!item.available}
          onClick={handleAddToCart}
        >
          <ShoppingBag className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
