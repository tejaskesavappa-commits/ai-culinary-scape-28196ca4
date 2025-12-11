import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Tag, Gift, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { availableCoupons } from '../data/coupons';
import { Coupon } from '../types';
import PaymentDetails from '../components/PaymentDetails';
import { supabase } from '@/integrations/supabase/client';

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, applyCoupon, removeCoupon } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [showCoupons, setShowCoupons] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    updateQuantity(id, newQuantity);
  };

  const finalTotal = cart.total + 40 + Math.round(cart.total * 0.18) - cart.discount;
  const pointsEarned = Math.floor(finalTotal / 10); // 1 point per ₹10 spent

  const handleApplyCoupon = () => {
    const coupon = availableCoupons.find(c => c.code === couponCode && c.isActive);
    if (coupon) {
      if (cart.total >= coupon.minOrder) {
        applyCoupon(coupon);
        toast({
          title: "Coupon Applied!",
          description: `${coupon.description}`,
        });
        setCouponCode('');
        setShowCoupons(false);
      } else {
        toast({
          title: "Invalid Coupon",
          description: `Minimum order amount is ₹${coupon.minOrder}`,
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Invalid Coupon",
        description: "Please enter a valid coupon code",
        variant: "destructive"
      });
    }
  };

  const handleSelectCoupon = (coupon: Coupon) => {
    if (cart.total >= coupon.minOrder) {
      applyCoupon(coupon);
      toast({
        title: "Coupon Applied!",
        description: `${coupon.description}`,
      });
      setShowCoupons(false);
    } else {
      toast({
        title: "Invalid Coupon",
        description: `Minimum order amount is ₹${coupon.minOrder}`,
        variant: "destructive"
      });
    }
  };

  const handlePaymentComplete = () => {
    toast({
      title: "Payment Submitted!",
      description: `Your payment reference has been submitted for verification. ${user ? `You'll earn ${pointsEarned} points once verified!` : 'Login to earn points!'}`,
    });
    clearCart();
    setShowPayment(false);
    setCurrentOrderId(null);
    navigate('/orders');
  };

  const handleProceedToPayment = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to place an order",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setIsCreatingOrder(true);
    
    try {
      // Create the order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: finalTotal,
          delivery_address: 'To be provided',
          phone: 'To be provided',
          payment_method: 'upi',
          payment_status: 'pending',
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        toast({
          title: "Error",
          description: "Failed to create order. Please try again.",
          variant: "destructive",
        });
        setIsCreatingOrder(false);
        return;
      }

      // Add restaurant order items (using the new table for non-UUID menu item IDs)
      const orderItems = cart.items.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        menu_item_name: item.name,
        restaurant_id: item.restaurantId,
        restaurant_name: item.restaurantName,
        quantity: item.quantity,
        price: item.price,
        is_veg: item.isVeg || false,
      }));

      const { error: itemsError } = await supabase
        .from('restaurant_order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error adding order items:', itemsError);
        // Still proceed as order was created
      }

      setCurrentOrderId(order.id);
      setShowPayment(true);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (showPayment) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <PaymentDetails 
              total={finalTotal}
              orderId={currentOrderId || undefined}
              onPaymentComplete={handlePaymentComplete}
              onBack={() => {
                setShowPayment(false);
                setCurrentOrderId(null);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/">
            <Button variant="hero" size="lg">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Your Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="bg-card rounded-lg p-4 border border-border">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.restaurantName}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-price">
                            ₹{item.price * item.quantity}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ₹{item.price} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg p-6 border border-border sticky top-4">
                <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>
                
                {/* Coupon Section */}
                <div className="mb-4">
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleApplyCoupon} variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowCoupons(!showCoupons)}
                    className="text-primary hover:text-primary"
                  >
                    <Tag className="h-4 w-4 mr-1" />
                    View Available Coupons
                  </Button>

                  {showCoupons && (
                    <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                      {availableCoupons.filter(c => c.isActive).map((coupon) => (
                        <div 
                          key={coupon.id} 
                          className="p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                          onClick={() => handleSelectCoupon(coupon)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-mono text-sm font-bold text-primary">{coupon.code}</span>
                              <p className="text-xs text-muted-foreground mt-1">{coupon.description}</p>
                              <p className="text-xs text-muted-foreground">Min order: ₹{coupon.minOrder}</p>
                            </div>
                            <Gift className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {cart.appliedCoupon && (
                    <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">{cart.appliedCoupon.code} applied</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          removeCoupon();
                          toast({ title: "Coupon removed" });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{cart.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-medium">₹40</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes</span>
                    <span className="font-medium">₹{Math.round(cart.total * 0.18)}</span>
                  </div>
                  {cart.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{cart.discount}</span>
                    </div>
                  )}
                  <hr className="border-border" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-price">₹{finalTotal}</span>
                  </div>
                  {user && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Points to earn</span>
                      <span className="text-primary font-medium">{pointsEarned} points</span>
                    </div>
                  )}
                </div>

                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full mb-3"
                  onClick={handleProceedToPayment}
                  disabled={isCreatingOrder}
                >
                  {isCreatingOrder ? 'Creating Order...' : 'Proceed to Payment'}
                </Button>
                
                <Link to="/">
                  <Button variant="outline" size="lg" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;