import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Star, Utensils, Truck, ChefHat, Store } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { RestaurantCard } from '../components/RestaurantCard';
import { restaurants } from '../data/restaurants';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '../assets/hero-food.jpg';

interface ApprovedRestaurant {
  id: string;
  name: string;
  cuisine_type: string;
  rating: number;
  avg_delivery_time: string;
  image_url: string | null;
  description: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [approvedRestaurants, setApprovedRestaurants] = useState<ApprovedRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchAddress, setSearchAddress] = useState('');

  const handleSearch = () => {
    // Navigate to quick-order page which shows all restaurants
    navigate('/quick-order');
  };

  useEffect(() => {
    const fetchApprovedRestaurants = async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('id, name, cuisine_type, rating, avg_delivery_time, image_url, description')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setApprovedRestaurants(data);
      }
      setLoading(false);
    };

    fetchApprovedRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/60"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-hero-gradient bg-clip-text text-transparent animate-fade-in">
            FOODIEXPRESS
            <br />
            <span className="text-3xl md:text-4xl text-foreground">Delicious Food, Delivered Fast</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in">
            Order from the best restaurants in your city. Fresh, fast, and delicious!
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto mb-8">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Enter your delivery address"
                className="pl-10 h-12 bg-card border-border"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button variant="hero" size="lg" className="h-12 px-8" onClick={handleSearch}>
              <Search className="h-5 w-5 mr-2" />
              Find Food
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>30 min delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>4.5+ rated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Popular Restaurants
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover amazing food from the most loved restaurants in your area
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="animate-fade-in">
                <RestaurantCard restaurant={restaurant} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View All Restaurants
            </Button>
          </div>
        </div>
      </section>

      {/* Newly Approved Restaurants */}
      {approvedRestaurants.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-secondary text-secondary-foreground">New Partners</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Recently Joined Restaurants
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These restaurants just partnered with us and will be serving delicious food soon!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedRestaurants.map((restaurant) => (
                <Card key={restaurant.id} className="overflow-hidden border-border hover:shadow-lg transition-shadow">
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Store className="h-16 w-16 text-primary/50" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg">{restaurant.name}</h3>
                      <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {restaurant.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="capitalize">{restaurant.cuisine_type}</span>
                      <span>•</span>
                      <span>{restaurant.avg_delivery_time}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">Get your food delivered in 30 minutes or less</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Food</h3>
              <p className="text-muted-foreground">Only partnered with the best restaurants</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Top Chefs</h3>
              <p className="text-muted-foreground">Food prepared by skilled culinary experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Own a Restaurant?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Partner with FOODIEXPRESS and reach millions of hungry customers. 
            Grow your business with our platform.
          </p>
          <Link to="/register-restaurant">
            <Button variant="hero" size="lg">
              Register Your Restaurant
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
