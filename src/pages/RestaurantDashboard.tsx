import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  ChefHat, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Clock, 
  Package,
  DollarSign,
  UtensilsCrossed,
  AlertCircle
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
  image?: string;
}

interface Order {
  id: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'declined';
  createdAt: string;
  address: string;
  phone: string;
}

const RestaurantDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'Main Course',
    isVeg: true,
    isAvailable: true,
  });

  const categories = [
    'Starters',
    'Main Course',
    'Biryani & Rice',
    'Indian Breads',
    'Soups',
    'Desserts',
    'Beverages',
  ];

  useEffect(() => {
    if (!user) {
      navigate('/restaurant-login');
      return;
    }
    fetchRestaurantData();
  }, [user, navigate]);

  const fetchRestaurantData = async () => {
    try {
      // Fetch restaurant by email
      const { data: restaurantData, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('email', user?.email)
        .maybeSingle();

      if (error) {
        console.error('Error fetching restaurant:', error);
        toast({
          title: "Error",
          description: "Failed to load restaurant data. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!restaurantData) {
        toast({
          title: "Access Denied",
          description: "No restaurant found for this account. Please register first.",
          variant: "destructive",
        });
        navigate('/register-restaurant');
        return;
      }

      setRestaurant(restaurantData);
      
      // Load mock menu items for demo (in production, fetch from DB)
      const mockMenuItems: MenuItem[] = [
        { id: '1', name: 'Butter Chicken', description: 'Creamy tomato curry with tender chicken', price: 350, category: 'Main Course', isVeg: false, isAvailable: true },
        { id: '2', name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 280, category: 'Starters', isVeg: true, isAvailable: true },
        { id: '3', name: 'Chicken Biryani', description: 'Fragrant rice with spiced chicken', price: 320, category: 'Biryani & Rice', isVeg: false, isAvailable: true },
        { id: '4', name: 'Dal Makhani', description: 'Creamy black lentils', price: 220, category: 'Main Course', isVeg: true, isAvailable: true },
        { id: '5', name: 'Gulab Jamun', description: 'Sweet milk dumplings in syrup', price: 120, category: 'Desserts', isVeg: true, isAvailable: true },
      ];
      setMenuItems(mockMenuItems);

      // Load mock orders for demo
      const mockOrders: Order[] = [
        {
          id: 'ORD001',
          customerName: 'Rahul Sharma',
          items: [
            { name: 'Butter Chicken', quantity: 2, price: 350 },
            { name: 'Naan', quantity: 4, price: 40 }
          ],
          total: 860,
          status: 'pending',
          createdAt: new Date().toISOString(),
          address: '123 Main Street, Mumbai',
          phone: '+91 9876543210'
        },
        {
          id: 'ORD002',
          customerName: 'Priya Patel',
          items: [
            { name: 'Paneer Tikka', quantity: 1, price: 280 },
            { name: 'Dal Makhani', quantity: 1, price: 220 }
          ],
          total: 500,
          status: 'accepted',
          createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
          address: '456 Park Avenue, Mumbai',
          phone: '+91 9876543211'
        },
      ];
      setOrders(mockOrders);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenuItem = () => {
    if (!newItem.name || !newItem.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name!,
      description: newItem.description || '',
      price: newItem.price!,
      category: newItem.category || 'Main Course',
      isVeg: newItem.isVeg ?? true,
      isAvailable: newItem.isAvailable ?? true,
    };

    setMenuItems([...menuItems, item]);
    setNewItem({
      name: '',
      description: '',
      price: 0,
      category: 'Main Course',
      isVeg: true,
      isAvailable: true,
    });
    setIsAddingItem(false);
    
    toast({
      title: "Item Added",
      description: `${item.name} has been added to your menu`,
    });
  };

  const handleUpdateMenuItem = () => {
    if (!editingItem) return;

    setMenuItems(menuItems.map(item => 
      item.id === editingItem.id ? editingItem : item
    ));
    setEditingItem(null);
    
    toast({
      title: "Item Updated",
      description: `${editingItem.name} has been updated`,
    });
  };

  const handleDeleteMenuItem = (id: string) => {
    const item = menuItems.find(i => i.id === id);
    setMenuItems(menuItems.filter(i => i.id !== id));
    
    toast({
      title: "Item Deleted",
      description: `${item?.name} has been removed from your menu`,
    });
  };

  const handleToggleAvailability = (id: string) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const handleOrderAction = (orderId: string, action: 'accept' | 'decline' | 'preparing' | 'ready') => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        let newStatus: Order['status'] = order.status;
        switch (action) {
          case 'accept':
            newStatus = 'accepted';
            break;
          case 'decline':
            newStatus = 'declined';
            break;
          case 'preparing':
            newStatus = 'preparing';
            break;
          case 'ready':
            newStatus = 'ready';
            break;
        }
        return { ...order, status: newStatus };
      }
      return order;
    }));

    const actionMessages = {
      accept: 'Order accepted! Start preparing.',
      decline: 'Order has been declined.',
      preparing: 'Order marked as preparing.',
      ready: 'Order is ready for pickup!',
    };

    toast({
      title: "Order Updated",
      description: actionMessages[action],
    });
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-blue-500';
      case 'preparing': return 'bg-orange-500';
      case 'ready': return 'bg-green-500';
      case 'declined': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-6 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <ChefHat className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{restaurant?.name || 'Restaurant Dashboard'}</h1>
              <p className="text-white/80">{restaurant?.cuisine_type} • {restaurant?.avg_delivery_time}</p>
            </div>
          </div>
          <Button variant="outline" className="text-white border-white hover:bg-white/20" onClick={() => signOut()}>
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4">
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Menu
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Active Orders</h2>
              <Badge variant="secondary">{orders.filter(o => o.status !== 'declined').length} orders</Badge>
            </div>

            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No orders yet. They will appear here when customers place orders.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                          <CardDescription>{order.customerName} • {order.phone}</CardDescription>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="bg-muted/50 rounded-lg p-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm py-1">
                              <span>{item.quantity}x {item.name}</span>
                              <span>₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                          <div className="border-t border-border mt-2 pt-2 flex justify-between font-semibold">
                            <span>Total</span>
                            <span>₹{order.total}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Delivery:</span> {order.address}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(order.createdAt).toLocaleString()}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          {order.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={() => handleOrderAction(order.id, 'accept')}
                              >
                                <Check className="h-4 w-4 mr-1" /> Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                className="flex-1"
                                onClick={() => handleOrderAction(order.id, 'decline')}
                              >
                                <X className="h-4 w-4 mr-1" /> Decline
                              </Button>
                            </>
                          )}
                          {order.status === 'accepted' && (
                            <Button 
                              size="sm" 
                              className="flex-1 bg-orange-500 hover:bg-orange-600"
                              onClick={() => handleOrderAction(order.id, 'preparing')}
                            >
                              Start Preparing
                            </Button>
                          )}
                          {order.status === 'preparing' && (
                            <Button 
                              size="sm" 
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => handleOrderAction(order.id, 'ready')}
                            >
                              Mark as Ready
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Menu Items</h2>
              <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Menu Item</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Item Name *</Label>
                      <Input
                        placeholder="e.g., Butter Chicken"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe your dish..."
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Price (₹) *</Label>
                        <Input
                          type="number"
                          placeholder="299"
                          value={newItem.price || ''}
                          onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={newItem.category}
                          onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Vegetarian</Label>
                      <Switch
                        checked={newItem.isVeg}
                        onCheckedChange={(checked) => setNewItem({ ...newItem, isVeg: checked })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingItem(false)}>Cancel</Button>
                    <Button onClick={handleAddMenuItem}>Add Item</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Menu Items Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {menuItems.map((item) => (
                <Card key={item.id} className={`${!item.isAvailable ? 'opacity-60' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                          <h3 className="font-semibold">{item.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{item.category}</Badge>
                          <span className="font-semibold text-primary">₹{item.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.isAvailable}
                          onCheckedChange={() => handleToggleAvailability(item.id)}
                        />
                        <span className="text-xs text-muted-foreground">
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="icon" variant="ghost" onClick={() => setEditingItem(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Menu Item</DialogTitle>
                            </DialogHeader>
                            {editingItem && (
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Item Name</Label>
                                  <Input
                                    value={editingItem.name}
                                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Description</Label>
                                  <Textarea
                                    value={editingItem.description}
                                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Price (₹)</Label>
                                    <Input
                                      type="number"
                                      value={editingItem.price}
                                      onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select
                                      value={editingItem.category}
                                      onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {categories.map((cat) => (
                                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <Label>Vegetarian</Label>
                                  <Switch
                                    checked={editingItem.isVeg}
                                    onCheckedChange={(checked) => setEditingItem({ ...editingItem, isVeg: checked })}
                                  />
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
                              <Button onClick={handleUpdateMenuItem}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteMenuItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
