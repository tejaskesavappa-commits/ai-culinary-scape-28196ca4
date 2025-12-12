import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/contexts/ProductContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Minus, Plus, Trash2, Loader2, QrCode, Smartphone, Banknote, CreditCard, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentMethod } from '@/types/database';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PaymentDetails from '@/components/PaymentDetails';
import { z } from 'zod';

const checkoutSchema = z.object({
  phone: z.string()
    .trim()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  address: z.string()
    .trim()
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address is too long (max 500 characters)'),
  notes: z.string()
    .max(1000, 'Notes are too long (max 1000 characters)')
    .optional()
    .or(z.literal(''))
});

type PaymentOption = 'upi' | 'qr' | 'cod' | 'netbanking';

const isUuid = (value: string): boolean => {
  // Basic UUID v4 format check
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value);
};

const Checkout = () => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal, clearCart } = useProducts();
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(profile?.address || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [notes, setNotes] = useState('');
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('upi');
  const [showUPIDialog, setShowUPIDialog] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to checkout');
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Update address/phone when profile loads
  useEffect(() => {
    if (profile?.address) setAddress(profile.address);
    if (profile?.phone) setPhone(profile.phone);
  }, [profile]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <LogIn className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className="text-muted-foreground mb-6">Please login to proceed with checkout</p>
          <Button onClick={() => navigate('/login')} size="lg">
            <LogIn className="w-4 h-4 mr-2" />
            Login to Continue
          </Button>
        </Card>
      </div>
    );
  }

  const createOrderForPayment = async (): Promise<string | null> => {
    if (!user || !address || !phone) {
      toast.error('Please fill in all delivery details');
      return null;
    }

    const validation = checkoutSchema.safeParse({ phone, address, notes });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return null;
    }

    try {
      const estimatedMinutes = Math.floor(Math.random() * 6) + 15;
      const estimatedDeliveryTime = new Date();
      estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + estimatedMinutes);

      const dbPaymentMethod: PaymentMethod = paymentOption === 'cod' ? 'cod' : 'upi';

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: getCartTotal(),
          delivery_address: address,
          phone,
          payment_method: dbPaymentMethod,
          notes: notes || null,
          estimated_delivery_time: estimatedDeliveryTime.toISOString()
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items for orders table (uses order_items, not restaurant_order_items)
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: String(item.id),
        quantity: item.quantity,
        price: Number(item.price),
      }));

      if (orderItems.length > 0) {
        await supabase.from('order_items').insert(orderItems);
      }

      // Create initial order status history
      await supabase.from('order_status_history').insert([{
        order_id: order.id,
        status: 'pending',
        updated_by: user.id,
        notes: 'Order placed - awaiting payment'
      }]);

      return order.id;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create order');
      return null;
    }
  };

  const handleShowUPIPayment = async () => {
    if (!address || !phone) {
      toast.error('Please fill in delivery details first');
      return;
    }
    
    setLoading(true);
    const orderId = await createOrderForPayment();
    setLoading(false);
    
    if (orderId) {
      setCurrentOrderId(orderId);
      setShowUPIDialog(true);
    }
  };

  const handlePaymentComplete = async () => {
    setShowUPIDialog(false);
    
    const { data: { session } } = await supabase.auth.getSession();
    
    // Send notification email and SMS
    if (currentOrderId && session?.access_token) {
      try {
        // Send email notification
        await supabase.functions.invoke('send-order-notification', {
          body: { orderId: currentOrderId },
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
      } catch (e) {
        // Email failed but order is placed
      }
      
      // Send SMS notification
      if (phone) {
        try {
          await supabase.functions.invoke('send-order-sms', {
            body: { orderId: currentOrderId, phone, totalAmount: getCartTotal() },
            headers: { Authorization: `Bearer ${session.access_token}` }
          });
        } catch (e) {
          // SMS failed but order is placed
        }
      }
    }
    
    toast.success('Order placed successfully!');
    clearCart();
    setCurrentOrderId(null);
    navigate('/orders');
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please login to place order');
      return;
    }

    if (!address || !phone) {
      toast.error('Please fill in delivery details');
      return;
    }

    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    // Validate inputs
    const validation = checkoutSchema.safeParse({
      phone: phone,
      address: address,
      notes: notes
    });

    if (!validation.success) {
      const errors = validation.error.errors;
      toast.error(errors[0].message);
      return;
    }

    try {
      setLoading(true);

      // Calculate estimated delivery time (15-20 minutes from now)
      const estimatedMinutes = Math.floor(Math.random() * 6) + 15; // 15-20 minutes
      const estimatedDeliveryTime = new Date();
      estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + estimatedMinutes);

      // Map payment option to database payment method
      const dbPaymentMethod: PaymentMethod = paymentOption === 'qr' ? 'upi' : 
                                              paymentOption === 'netbanking' ? 'upi' : 
                                              paymentOption === 'cod' ? 'cod' : 'upi';

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: getCartTotal(),
          delivery_address: address,
          phone,
          payment_method: dbPaymentMethod,
          notes: notes || null,
          estimated_delivery_time: estimatedDeliveryTime.toISOString()
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items for orders table (uses order_items, not restaurant_order_items)
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: String(item.id),
        quantity: item.quantity,
        price: Number(item.price),
      }));

      if (orderItems.length > 0) {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      // Create initial order status history
      await supabase
        .from('order_status_history')
        .insert([{
          order_id: order.id,
          status: 'pending',
          updated_by: user.id,
          notes: 'Order placed'
        }]);

      // Send order notification email and SMS
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          // Send email notification
          await supabase.functions.invoke('send-order-notification', {
            body: { orderId: order.id },
            headers: { Authorization: `Bearer ${session.access_token}` }
          });
          
          // Send SMS notification
          if (phone) {
            await supabase.functions.invoke('send-order-sms', {
              body: { orderId: order.id, phone, totalAmount: getCartTotal() },
              headers: { Authorization: `Bearer ${session.access_token}` }
            });
          }
        }
      } catch (notificationError) {
        // Notifications failed but order is placed successfully
      }

      toast.success(`Order placed successfully! ETA: ${estimatedMinutes} minutes`);
      clearCart();
      navigate('/orders');
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  const total = getCartTotal();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Cart Items</h2>
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-0">
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">₹{Number(item.price).toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="font-semibold w-24 text-right">
                    ₹{(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </Card>

            {/* Delivery Details */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Delivery Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter complete delivery address"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special instructions?"
                    rows={2}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-4">
              <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>₹0.00</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <Label className="mb-3 block font-semibold">Select Payment Method</Label>
                <RadioGroup value={paymentOption} onValueChange={(v) => setPaymentOption(v as PaymentOption)} className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                    <RadioGroupItem value="upi" id="upi" />
                    <Smartphone className="w-5 h-5 text-primary" />
                    <Label htmlFor="upi" className="cursor-pointer flex-1">UPI (PhonePe, GPay, Paytm)</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                    <RadioGroupItem value="qr" id="qr" />
                    <QrCode className="w-5 h-5 text-primary" />
                    <Label htmlFor="qr" className="cursor-pointer flex-1">Scan & Pay (QR Code)</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                    <RadioGroupItem value="cod" id="cod" />
                    <Banknote className="w-5 h-5 text-green-600" />
                    <Label htmlFor="cod" className="cursor-pointer flex-1">Cash on Delivery</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <Label htmlFor="netbanking" className="cursor-pointer flex-1">Net Banking</Label>
                  </div>
                </RadioGroup>
              </div>

              {(paymentOption === 'upi' || paymentOption === 'qr') && (
                <Button
                  variant="outline"
                  className="w-full mb-3"
                  onClick={handleShowUPIPayment}
                  disabled={loading}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  {loading ? 'Creating Order...' : paymentOption === 'qr' ? 'Scan & Pay with QR' : 'Pay via UPI'}
                </Button>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={loading || paymentOption === 'upi' || paymentOption === 'qr'}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Placing Order...
                  </>
                ) : paymentOption === 'cod' ? (
                  'Place Order (Cash on Delivery)'
                ) : paymentOption === 'netbanking' ? (
                  'Place Order (Net Banking)'
                ) : (
                  'Complete Payment First'
                )}
              </Button>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={showUPIDialog} onOpenChange={setShowUPIDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>UPI Payment</DialogTitle>
          </DialogHeader>
          <PaymentDetails
            total={total}
            orderId={currentOrderId || undefined}
            onPaymentComplete={handlePaymentComplete}
            onBack={() => setShowUPIDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
