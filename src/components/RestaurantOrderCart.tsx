import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, X, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PaymentDetails from './PaymentDetails';
import { useNavigate } from 'react-router-dom';

interface RestaurantOrderCartProps {
  restaurantId: string;
  restaurantName: string;
}

export const RestaurantOrderCart: React.FC<RestaurantOrderCartProps> = ({ restaurantId, restaurantName }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'cart' | 'details' | 'payment'>('cart');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Filter cart items for this restaurant only
  const restaurantCart = cart.items.filter(item => item.restaurantId === restaurantId);
  const cartTotal = restaurantCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = restaurantCart.reduce((sum, item) => sum + item.quantity, 0);

  const handleProceedToDetails = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to place an order",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    setStep('details');
  };

  const handleProceedToPayment = async () => {
    if (!phone.trim() || !address.trim()) {
      toast({
        title: "Missing Details",
        description: "Please enter phone number and delivery address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user!.id,
          total_amount: cartTotal,
          status: 'pending',
          payment_method: 'upi',
          payment_status: 'pending',
          phone: phone.trim(),
          delivery_address: address.trim(),
          notes: notes.trim() || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create restaurant order items (separate table for restaurant menu items)
      const orderItems = restaurantCart.map(item => ({
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

      if (itemsError) throw itemsError;

      // Create initial order status history
      await supabase
        .from('order_status_history')
        .insert({
          order_id: order.id,
          status: 'pending',
          notes: `Order placed from ${restaurantName}`,
        });

      setOrderId(order.id);
      setStep('payment');

      toast({
        title: "Order Created",
        description: "Please complete the payment",
      });

    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentComplete = () => {
    // Clear restaurant items from cart
    restaurantCart.forEach(item => removeFromCart(item.id));
    setIsOpen(false);
    setStep('cart');
    setOrderId(null);
    toast({
      title: "Order Placed Successfully!",
      description: "Your order is being prepared. Track it in Orders section.",
    });
    navigate('/orders');
  };

  const resetToCart = () => {
    setStep('cart');
  };

  if (restaurantCart.length === 0) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="hero" 
          size="lg"
          className="fixed bottom-6 right-6 z-50 shadow-lg animate-bounce-subtle"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {itemCount} items • ₹{cartTotal}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {step === 'cart' && `Your Order from ${restaurantName}`}
            {step === 'details' && 'Delivery Details'}
            {step === 'payment' && 'Complete Payment'}
          </SheetTitle>
        </SheetHeader>

        {step === 'cart' && (
          <div className="mt-6 space-y-4">
            {restaurantCart.map((item) => (
              <Card key={item.id} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>

            <Button 
              variant="hero" 
              className="w-full"
              onClick={handleProceedToDetails}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Proceed to Checkout
            </Button>
          </div>
        )}

        {step === 'details' && (
          <div className="mt-6 space-y-6">
            <Button variant="ghost" size="sm" onClick={resetToCart}>
              ← Back to Cart
            </Button>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="notes">Special Instructions (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requests for your order..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex justify-between font-bold">
                  <span>Total to Pay</span>
                  <span>₹{cartTotal}</span>
                </div>
              </CardContent>
            </Card>

            <Button 
              variant="hero" 
              className="w-full"
              onClick={handleProceedToPayment}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Order...' : 'Proceed to Payment'}
            </Button>
          </div>
        )}

        {step === 'payment' && orderId && (
          <div className="mt-6">
            <PaymentDetails
              total={cartTotal}
              orderId={orderId}
              onPaymentComplete={handlePaymentComplete}
              onBack={() => setStep('details')}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
