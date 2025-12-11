export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg?: boolean;
  isAlcoholic?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
  description: string;
  menu: MenuItem[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  isVeg?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discount: number; // percentage discount
  minOrder: number;
  maxDiscount?: number;
  isActive: boolean;
}