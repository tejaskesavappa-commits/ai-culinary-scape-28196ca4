import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Package, MapPin, Phone, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Order, DeliveryPartner, OrderStatusHistory, OrderStatus } from '@/types/database';
import DeliveryPartnerRegistration from '@/components/DeliveryPartnerRegistration';

const DeliveryDashboard = () => {
  const { user } = useAuth();
  const [deliveryPartner, setDeliveryPartner] = useState<DeliveryPartner | null>(null);
  const [orders, setOrders] = useState<(Order & { order_items?: any[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDeliveryPartner();
      fetchAssignedOrders();
      subscribeToOrders();
    }
  }, [user]);

  const fetchDeliveryPartner = async () => {
    const { data, error } = await supabase
      .from('delivery_partners')
      .select('*')
      .eq('user_id', user?.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching delivery partner:', error);
    }
    
    setDeliveryPartner(data || null);
    setLoading(false);
  };

  const fetchAssignedOrders = async () => {
    if (!deliveryPartner) return;

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (name)
        )
      `)
      .eq('delivery_partner_id', deliveryPartner.id)
      .in('status', ['confirmed', 'preparing', 'out_for_delivery'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      const typedOrders = (data || []).map(order => ({
        ...order,
        status: order.status as OrderStatus,
      })) as (Order & { order_items?: any[] })[];
      setOrders(typedOrders);
    }
    setLoading(false);
  };

  const subscribeToOrders = () => {
    const channel = supabase
      .channel('delivery-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          fetchAssignedOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const toggleAvailability = async (available: boolean) => {
    if (!deliveryPartner) return;

    const { error } = await supabase
      .from('delivery_partners')
      .update({ is_available: available })
      .eq('id', deliveryPartner.id);

    if (error) {
      toast.error('Failed to update availability');
    } else {
      setDeliveryPartner({ ...deliveryPartner, is_available: available });
      toast.success(available ? 'You are now available' : 'You are now offline');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    // Define valid status transitions for delivery partners
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['preparing', 'cancelled'],
      'preparing': ['out_for_delivery', 'cancelled'],
      'out_for_delivery': ['delivered', 'cancelled'],
      'delivered': [],
      'cancelled': []
    };

    // Fetch current order status
    const { data: order } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .single();

    if (!order) {
      toast.error('Order not found');
      return;
    }

    // Validate transition
    const allowedStatuses = validTransitions[order.status];
    if (!allowedStatuses.includes(newStatus)) {
      toast.error(`Cannot change status from ${order.status} to ${newStatus}`);
      return;
    }

    const { error: orderError } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (orderError) {
      toast.error('Failed to update order status');
      return;
    }

    // Add to history
    await supabase
      .from('order_status_history')
      .insert([{
        order_id: orderId,
        status: newStatus,
        updated_by: user?.id,
      }]);

    toast.success('Order status updated');
    fetchAssignedOrders();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      confirmed: 'bg-blue-500',
      preparing: 'bg-yellow-500',
      out_for_delivery: 'bg-purple-500',
      delivered: 'bg-green-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Show registration form if no delivery partner record exists
  if (!deliveryPartner) {
    return <DeliveryPartnerRegistration onRegistrationComplete={fetchDeliveryPartner} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Delivery Dashboard</h1>
          <div className="flex items-center gap-4">
            <Label htmlFor="availability">Available</Label>
            <Switch
              id="availability"
              checked={deliveryPartner?.is_available || false}
              onCheckedChange={toggleAvailability}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Total Deliveries</div>
            <div className="text-3xl font-bold">{deliveryPartner?.total_deliveries || 0}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Rating</div>
            <div className="text-3xl font-bold">{deliveryPartner?.rating.toFixed(1) || '0.0'}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Active Orders</div>
            <div className="text-3xl font-bold">{orders.length}</div>
          </Card>
        </div>

        {/* Orders */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Assigned Orders</h2>
          {orders.length === 0 ? (
            <Card className="p-8 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No active orders assigned</p>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">Order #{order.id.slice(0, 8)}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ₹{Number(order.total_amount).toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleTimeString()}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                    <span className="text-sm">{order.delivery_address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{order.phone}</span>
                  </div>
                  {order.estimated_delivery_time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        ETA: {new Date(order.estimated_delivery_time).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {order.status === 'confirmed' && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                    >
                      Start Delivery
                    </Button>
                  )}
                  {order.status === 'preparing' && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                    >
                      Pick Up Order
                    </Button>
                  )}
                  {order.status === 'out_for_delivery' && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Delivered
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default DeliveryDashboard;
