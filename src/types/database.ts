export type ProductCategory = 
  | 'alcoholic_beverages'
  | 'electronics'
  | 'vegetables'
  | 'chips_snacks'
  | 'pizza_burger'
  | 'clothing'
  | 'biryanis'
  | 'groceries'
  | 'fruits'
  | 'dairy'
  | 'beverages'
  | 'packaged_food'
  | 'mens_fashion'
  | 'womens_fashion'
  | 'kids_fashion'
  | 'shoes'
  | 'accessories'
  | 'mobiles'
  | 'laptops'
  | 'tablets'
  | 'smartwatches'
  | 'audio'
  | 'furniture'
  | 'home_decor'
  | 'kitchenware'
  | 'automobiles'
  | 'auto_accessories'
  | 'health_beauty'
  | 'personal_care'
  | 'household'
  | 'cleaning'
  | 'toys'
  | 'books'
  | 'sports'
  | 'fitness'
  | 'pet_supplies';

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'upi' | 'phonepe' | 'gpay' | 'cod';
export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type AppRole = 'admin' | 'user' | 'delivery_partner';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: ProductCategory;
  price: number;
  image_url: string | null;
  images: string[];
  stock_quantity: number;
  is_available: boolean;
  is_alcoholic: boolean;
  rating: number;
  discount: number;
  vendor: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  delivery_address: string;
  phone: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_id: string | null;
  notes: string | null;
  delivery_partner_id: string | null;
  estimated_delivery_time: string | null;
  actual_delivery_time: string | null;
  delivery_latitude: number | null;
  delivery_longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface DeliveryPartner {
  id: string;
  user_id: string;
  vehicle_type: string | null;
  vehicle_number: string | null;
  is_available: boolean;
  current_latitude: number | null;
  current_longitude: number | null;
  rating: number;
  total_deliveries: number;
  created_at: string;
  updated_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  updated_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  product?: Product;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  alcoholic_beverages: '🍻 Alcoholic Beverages',
  electronics: '⚡ Electronics',
  vegetables: '🥕 Vegetables',
  chips_snacks: '🍟 Chips & Snacks',
  pizza_burger: '🍕 Pizza & Burger',
  clothing: '👕 Clothing',
  biryanis: '🍗 Biryanis & More',
  groceries: '🛒 Groceries',
  fruits: '🍎 Fresh Fruits',
  dairy: '🥛 Dairy Products',
  beverages: '☕ Beverages',
  packaged_food: '📦 Packaged Food',
  mens_fashion: '👔 Men\'s Fashion',
  womens_fashion: '👗 Women\'s Fashion',
  kids_fashion: '👶 Kids Fashion',
  shoes: '👟 Footwear',
  accessories: '👜 Accessories',
  mobiles: '📱 Mobile Phones',
  laptops: '💻 Laptops',
  tablets: '📱 Tablets',
  smartwatches: '⌚ Smartwatches',
  audio: '🎧 Audio & Headphones',
  furniture: '🛋️ Furniture',
  home_decor: '🏠 Home Decor',
  kitchenware: '🍳 Kitchenware',
  automobiles: '🚗 Automobiles',
  auto_accessories: '🔧 Auto Accessories',
  health_beauty: '💄 Health & Beauty',
  personal_care: '🧴 Personal Care',
  household: '🏡 Household Essentials',
  cleaning: '🧹 Cleaning Supplies',
  toys: '🧸 Toys & Games',
  books: '📚 Books',
  sports: '⚽ Sports',
  fitness: '💪 Fitness',
  pet_supplies: '🐾 Pet Supplies'
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};
