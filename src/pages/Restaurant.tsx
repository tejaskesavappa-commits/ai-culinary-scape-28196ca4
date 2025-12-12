import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock, MapPin, Sparkles, Leaf, Store, Loader2 } from 'lucide-react';
import { restaurants as staticRestaurants } from '../data/restaurants';
import { MenuItemCard } from '../components/MenuItemCard';
import { RestaurantOrderCart } from '../components/RestaurantOrderCart';
import { Button } from '../components/ui/button';
import { useCart } from '../contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg?: boolean;
  isAlcoholic?: boolean;
}

interface RestaurantData {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
  description: string;
  menu: MenuItem[];
}

const Restaurant: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;
      
      setLoading(true);
      
      // First check static restaurants
      const staticRestaurant = staticRestaurants.find(r => r.id === id);
      if (staticRestaurant) {
        setRestaurant({
          id: staticRestaurant.id,
          name: staticRestaurant.name,
          cuisine: staticRestaurant.cuisine,
          rating: staticRestaurant.rating,
          deliveryTime: staticRestaurant.deliveryTime,
          image: staticRestaurant.image,
          description: staticRestaurant.description,
          menu: staticRestaurant.menu.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
            price: item.price,
            image: item.image || '',
            category: item.category,
            isVeg: item.isVeg,
            isAlcoholic: item.isAlcoholic
          }))
        });
        setLoading(false);
        return;
      }
      
      // Otherwise fetch from Supabase
      try {
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', id)
          .single();
        
        if (restaurantError) throw restaurantError;
        
        if (!restaurantData) {
          setRestaurant(null);
          setLoading(false);
          return;
        }
        
        // Fetch menu items for this restaurant
        const { data: menuItems, error: menuError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', id)
          .eq('is_available', true);
        
        if (menuError) throw menuError;
        
        setRestaurant({
          id: restaurantData.id,
          name: restaurantData.name,
          cuisine: restaurantData.cuisine_type,
          rating: restaurantData.rating || 4.0,
          deliveryTime: restaurantData.avg_delivery_time,
          image: restaurantData.image_url || '',
          description: restaurantData.description,
          menu: (menuItems || []).map(item => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
            price: item.price,
            image: item.image_url || '',
            category: item.category,
            isVeg: item.is_veg ?? true,
            isAlcoholic: item.is_alcoholic ?? false
          }))
        });
      } catch (error: any) {
        console.error('Error fetching restaurant:', error);
        toast.error('Failed to load restaurant');
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurant();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Restaurant not found</h1>
          <p className="text-muted-foreground">The restaurant you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(restaurant.menu.map(item => item.category)))];
  
  // Get suggested items based on cart contents (same category items)
  const suggestedItems = useMemo(() => {
    const cartCategories = cart.items
      .filter(item => item.restaurantId === restaurant.id)
      .map(item => item.category);
    
    if (cartCategories.length === 0) {
      // If cart is empty, show popular items (first 3 items from different categories)
      const popular = restaurant.menu.slice(0, 6);
      return popular;
    }
    
    // Show items from same categories not in cart
    const cartItemIds = cart.items.map(item => item.id);
    const suggested = restaurant.menu
      .filter(item => cartCategories.includes(item.category) && !cartItemIds.includes(item.id))
      .slice(0, 4);
    
    return suggested.length > 0 ? suggested : restaurant.menu.slice(0, 4);
  }, [cart.items, restaurant]);

  // Filter menu based on veg/non-veg selection and category
  const filteredMenu = useMemo(() => {
    let filtered = restaurant.menu;
    
    // Apply veg/non-veg filter
    if (vegOnly && !nonVegOnly) {
      filtered = filtered.filter(item => item.isVeg === true);
    } else if (nonVegOnly && !vegOnly) {
      filtered = filtered.filter(item => item.isVeg === false || item.isAlcoholic);
    }
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    return filtered;
  }, [restaurant.menu, vegOnly, nonVegOnly, selectedCategory]);

  // Mark some items as popular/new (first few items in each category)
  const popularIds = restaurant.menu.slice(0, 3).map(i => i.id);
  const newIds = restaurant.menu.slice(-3).map(i => i.id);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {restaurant.image ? (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Store className="h-24 w-24 text-primary/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">
              {restaurant.name}
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground mb-3">{restaurant.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="font-medium">{restaurant.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{restaurant.cuisine}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Suggestions Section */}
        {suggestedItems.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Recommended for You</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {suggestedItems.map((item) => (
                <MenuItemCard
                  key={`suggested-${item.id}`}
                  item={item}
                  restaurantId={restaurant.id}
                  restaurantName={restaurant.name}
                  isPopular={popularIds.includes(item.id)}
                  isNew={newIds.includes(item.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Veg/Non-Veg Toggle & Category Filter */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-4 -mx-4 px-4 border-b border-border mb-6">
          <div className="flex flex-col gap-4">
            {/* Veg/Non-Veg Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant={vegOnly ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setVegOnly(!vegOnly);
                  if (nonVegOnly) setNonVegOnly(false);
                }}
                className={`gap-2 ${vegOnly ? 'bg-green-600 hover:bg-green-700 border-green-600' : 'border-green-600 text-green-600 hover:bg-green-50'}`}
              >
                <div className="w-4 h-4 border-2 border-current flex items-center justify-center rounded-sm">
                  <div className="w-2 h-2 rounded-full bg-current"></div>
                </div>
                Veg Only
              </Button>
              <Button
                variant={nonVegOnly ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setNonVegOnly(!nonVegOnly);
                  if (vegOnly) setVegOnly(false);
                }}
                className={`gap-2 ${nonVegOnly ? 'bg-red-600 hover:bg-red-700 border-red-600' : 'border-red-600 text-red-600 hover:bg-red-50'}`}
              >
                <div className="w-4 h-4 border-2 border-current flex items-center justify-center rounded-sm">
                  <div className="w-2 h-2 rounded-full bg-current"></div>
                </div>
                Non-Veg Only
              </Button>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full text-xs px-4 ${
                    selectedCategory === category 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card hover:bg-accent'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Title */}
        <h2 className="text-xl font-bold text-foreground mb-4">
          {selectedCategory === 'All' ? 'Full Menu' : selectedCategory}
          <span className="text-muted-foreground text-sm font-normal ml-2">
            ({filteredMenu.length} items)
          </span>
        </h2>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {filteredMenu.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
              isPopular={popularIds.includes(item.id)}
              isNew={newIds.includes(item.id)}
            />
          ))}
        </div>

        {filteredMenu.length === 0 && (
          <div className="text-center py-12">
            <Leaf className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-lg text-muted-foreground">
              No items found with current filters.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setVegOnly(false);
                setNonVegOnly(false);
                setSelectedCategory('All');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Floating Order Cart */}
      <RestaurantOrderCart 
        restaurantId={restaurant.id} 
        restaurantName={restaurant.name}
      />
    </div>
  );
};

export default Restaurant;
