import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus } from 'lucide-react';
import { type MenuItem } from '@/data/menuData';

interface FoodCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export const FoodCard = ({ item, onAddToCart }: FoodCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-hover transition-smooth group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
        />
        {!item.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
        <p className="text-2xl font-bold text-primary">₹{item.price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full"
          disabled={!item.available}
          onClick={() => onAddToCart(item, 1)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
