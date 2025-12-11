import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductCategory } from '@/types/database';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import type { CartItem as AppCartItem } from '@/types';

interface CartItem extends Product {
  quantity: number;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  filterByCategory: (category: ProductCategory | null) => void;
  selectedCategory: ProductCategory | null;
  fetchProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);

  const { cart: appCart, addToCart: addCartItem, removeFromCart: removeCartItem, updateQuantity, clearCart: clearAppCart } = useCart();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .order('name');

      if (error) throw error;
      const normalized: Product[] = (data || []).map((p: any) => ({
        ...p,
        images: Array.isArray(p?.images) ? p.images : [],
        image_url: typeof p?.image_url === 'string' ? p.image_url.trim() : p.image_url,
      }));
      setAllProducts(normalized);
      setProducts(normalized);
    } catch (error: any) {
      toast.error('Failed to load products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    
    // Refetch products when auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchProducts();
    });

    return () => subscription.unsubscribe();
  }, []);

  const filterByCategory = (category: ProductCategory | null) => {
    setSelectedCategory(category);
    if (category) {
      setProducts(allProducts.filter(p => p.category === category));
    } else {
      setProducts(allProducts);
    }
  };

  const mapProductToAppCartItem = (product: Product): AppCartItem => {
    const image = (product.images && product.images.length > 0 ? product.images[0] : product.image_url) || '';
    return {
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: Number(product.price),
      image,
      category: product.category as unknown as string,
      isVeg: undefined,
      isAlcoholic: !!product.is_alcoholic,
      quantity: 1,
      restaurantId: 'store',
      restaurantName: 'Store'
    };
  };

  const addToCart = (product: Product) => {
    addCartItem(mapProductToAppCartItem(product));
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (productId: string) => {
    removeCartItem(productId);
    toast.success('Item removed from cart');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  const clearCart = () => {
    clearAppCart();
  };

  const getCartTotal = () => {
    return Number(appCart.total) - Number(appCart.discount || 0);
  };

  // Maintain existing API shape for 'cart'
  const cart: CartItem[] = appCart.items.map((i: any) => ({
    id: i.id,
    name: i.name,
    description: i.description ?? null,
    category: (i.category as ProductCategory) || 'groceries',
    price: Number(i.price),
    image_url: i.image || null,
    images: i.image ? [i.image] : [],
    stock_quantity: 9999,
    is_available: true,
    is_alcoholic: !!i.isAlcoholic,
    rating: 0,
    discount: 0,
    vendor: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    quantity: i.quantity,
  }));
  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        filterByCategory,
        selectedCategory,
        fetchProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};
