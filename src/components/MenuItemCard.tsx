import React from 'react';
import { Plus, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';
import { MenuItem } from '../types';
import { Badge } from './ui/badge';

interface MenuItemCardProps {
  item: MenuItem;
  restaurantId: string;
  restaurantName: string;
  isPopular?: boolean;
  isNew?: boolean;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  restaurantId, 
  restaurantName,
  isPopular = false,
  isNew = false
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
      isVeg: item.isVeg,
      isAlcoholic: item.isAlcoholic,
      quantity: 1,
      restaurantId,
      restaurantName
    });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isPopular && (
            <Badge className="bg-pink-500 text-white text-[10px] px-2 py-0.5 flex items-center gap-1">
              <Heart className="w-3 h-3 fill-current" />
              Popular
            </Badge>
          )}
          {isNew && (
            <Badge className="bg-amber-500 text-white text-[10px] px-2 py-0.5">
              ✨ New
            </Badge>
          )}
        </div>

        {/* Veg/Non-Veg indicator */}
        <div className="absolute top-2 right-2">
          <div className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center bg-card ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
          </div>
        </div>

        {/* Alcoholic badge */}
        {item.isAlcoholic && (
          <div className="absolute bottom-2 right-2">
            <Badge className="bg-amber-600 text-white text-[10px]">21+</Badge>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3">
        <h4 className="font-semibold text-foreground text-sm md:text-base line-clamp-1 mb-1">
          {item.name}
        </h4>
        <p className="text-muted-foreground text-xs line-clamp-2 mb-3 min-h-[2rem]">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-price">₹{item.price}</span>
          <Button 
            onClick={handleAddToCart}
            size="sm"
            className="h-8 px-3 text-xs bg-primary hover:bg-primary/90"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};
