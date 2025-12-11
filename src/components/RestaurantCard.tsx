import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`}>
      <div className="bg-card rounded-lg overflow-hidden shadow-elegant hover:shadow-food-glow transition-all duration-300 hover:scale-105 group">
        <div className="relative">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{restaurant.rating}</span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-xl font-semibold text-foreground mb-1">{restaurant.name}</h3>
          <p className="text-muted-foreground text-sm mb-2">{restaurant.cuisine}</p>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{restaurant.description}</p>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{restaurant.deliveryTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};