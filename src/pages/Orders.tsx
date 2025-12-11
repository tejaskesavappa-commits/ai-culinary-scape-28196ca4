import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem, STATUS_LABELS } from '@/types/database';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, Clock } from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import OrderTracking from '@/components/OrderTracking';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<(Order & { order_items: OrderItem[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchOrders();

    // Subscribe to real-time order updates
    const channel = supabase
      .channel('orders-list-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (*)
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data as any);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {orders.map(order => (
                <Card 
                  key={order.id} 
                  className={`p-6 cursor-pointer transition-all ${
                    selectedOrderId === order.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedOrderId(order.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.created_at), 'PPp')}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                        {STATUS_LABELS[order.status]}
                      </Badge>
                      {order.estimated_delivery_time && order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <div className={`flex items-center gap-1 text-xs ${
                          isPast(new Date(order.estimated_delivery_time)) 
                            ? 'text-destructive' 
                            : 'text-primary'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>
                            {isPast(new Date(order.estimated_delivery_time)) 
                              ? 'Delayed' 
                              : `ETA: ${formatDistanceToNow(new Date(order.estimated_delivery_time), { addSuffix: true })}`
                            }
                          </span>
                        </div>
                      )}
                      {order.status === 'delivered' && order.actual_delivery_time && (
                        <p className="text-xs text-muted-foreground">
                          Delivered {format(new Date(order.actual_delivery_time), 'PPp')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.order_items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {(item.product as any)?.name} x {item.quantity}
                        </span>
                        <span>₹{(Number(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Delivery Address</p>
                      <p className="text-sm">{order.delivery_address}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-xl font-bold">₹{Number(order.total_amount).toFixed(2)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Tracking Panel */}
            <div className="lg:col-span-1">
              {selectedOrderId ? (
                <div className="sticky top-4">
                  <OrderTracking orderId={selectedOrderId} />
                </div>
              ) : (
                <Card className="p-8 text-center sticky top-4">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select an order to track
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
