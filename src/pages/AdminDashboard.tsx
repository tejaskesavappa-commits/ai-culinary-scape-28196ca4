import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem, STATUS_LABELS, OrderStatus } from '@/types/database';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Package, DollarSign, ShoppingBag, Users } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<(Order & { order_items: OrderItem[], profile: any })[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleVerified, setRoleVerified] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalUsers: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Wait for role verification before loading data
    if (isAdmin === false) {
      toast.error('Access denied. Admin only.');
      navigate('/');
      return;
    }

    if (isAdmin === true && !roleVerified) {
      setRoleVerified(true);
      fetchOrders();
      fetchStats();
    }

    // Set up real-time subscription for new orders
    const subscription = supabase
      .channel('admin-orders')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'orders'
      }, () => {
        fetchOrders();
        fetchStats();
        toast.success('New order received!');
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, isAdmin, navigate]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (*)
          ),
          profile:profiles (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data as any);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: ordersData } = await supabase
        .from('orders')
        .select('total_amount, status');

      const { data: usersData } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' });

      if (ordersData) {
        setStats({
          totalOrders: ordersData.length,
          totalRevenue: ordersData.reduce((sum, o) => sum + Number(o.total_amount), 0),
          pendingOrders: ordersData.filter(o => o.status === 'pending').length,
          totalUsers: usersData?.length || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // Define valid status transitions
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

      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  // Show loading until role verification completes
  if (!roleVerified || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-3xl font-bold">{stats.totalOrders}</p>
              </div>
              <ShoppingBag className="w-12 h-12 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="text-3xl font-bold">{stats.pendingOrders}</p>
              </div>
              <Package className="w-12 h-12 text-orange-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600" />
            </div>
          </Card>
        </div>

        {/* Orders List */}
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(order.created_at), 'PPp')}
                  </p>
                  <p className="text-sm">
                    Customer: {order.profile?.full_name || order.profile?.email}
                  </p>
                  <p className="text-sm">Phone: {order.phone}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Select
                    value={order.status}
                    onValueChange={(value) => updateOrderStatus(order.id, value as OrderStatus)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Badge variant={order.payment_status === 'completed' ? 'default' : 'secondary'}>
                    {order.payment_status}
                  </Badge>
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

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">Delivery Address</p>
                <p className="text-sm mb-2">{order.delivery_address}</p>
                {order.notes && (
                  <>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm mb-2">{order.notes}</p>
                  </>
                )}
                <div className="flex justify-between items-center">
                  <p className="text-sm">Payment: {order.payment_method.toUpperCase()}</p>
                  <p className="text-xl font-bold">₹{Number(order.total_amount).toFixed(2)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
