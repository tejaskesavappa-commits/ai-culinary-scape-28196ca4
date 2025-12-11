import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Package, Truck, CheckCircle, MapPin, Navigation } from 'lucide-react';
import { Order, OrderStatusHistory, OrderStatus } from '@/types/database';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface OrderTrackingProps {
  orderId: string;
}

interface DeliveryPartnerLocation {
  latitude: number;
  longitude: number;
}

const OrderTracking = ({ orderId }: OrderTrackingProps) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [history, setHistory] = useState<OrderStatusHistory[]>([]);
  const [deliveryLocation, setDeliveryLocation] = useState<DeliveryPartnerLocation | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const deliveryMarker = useRef<mapboxgl.Marker | null>(null);
  const destinationMarker = useRef<mapboxgl.Marker | null>(null);

  // Fetch Mapbox token
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (!error && data?.token) {
          setMapboxToken(data.token);
        }
      } catch (err) {
        console.error('Error fetching mapbox token:', err);
      }
    };
    fetchMapboxToken();
  }, []);

  useEffect(() => {
    fetchOrderDetails();
    fetchOrderHistory();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`order-tracking-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        () => {
          fetchOrderDetails();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_status_history',
          filter: `order_id=eq.${orderId}`,
        },
        () => {
          fetchOrderHistory();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'delivery_partners',
        },
        (payload) => {
          // Update delivery partner location in real-time
          if (payload.new) {
            const partner = payload.new as any;
            if (partner.current_latitude && partner.current_longitude) {
              setDeliveryLocation({
                latitude: partner.current_latitude,
                longitude: partner.current_longitude
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  // Fetch delivery partner location
  useEffect(() => {
    const fetchDeliveryPartner = async () => {
      if (!order?.delivery_partner_id) return;
      
      const { data, error } = await supabase
        .from('delivery_partners')
        .select('current_latitude, current_longitude')
        .eq('id', order.delivery_partner_id)
        .single();
      
      if (!error && data && data.current_latitude && data.current_longitude) {
        setDeliveryLocation({
          latitude: data.current_latitude,
          longitude: data.current_longitude
        });
      }
    };
    
    fetchDeliveryPartner();
  }, [order?.delivery_partner_id]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    // Default to a central location in India
    const defaultCenter: [number, number] = [78.9629, 20.5937];
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: defaultCenter,
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);

  // Update markers when order or delivery location changes
  useEffect(() => {
    if (!map.current || !order) return;

    // Add/update destination marker
    if (order.delivery_latitude && order.delivery_longitude) {
      const destCoords: [number, number] = [
        Number(order.delivery_longitude), 
        Number(order.delivery_latitude)
      ];
      
      if (destinationMarker.current) {
        destinationMarker.current.setLngLat(destCoords);
      } else {
        // Create destination marker element
        const destEl = document.createElement('div');
        destEl.className = 'destination-marker';
        destEl.innerHTML = `
          <div style="
            background: linear-gradient(135deg, #10B981, #059669);
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          ">
            <svg style="transform: rotate(45deg); width: 16px; height: 16px; color: white;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        `;
        
        destinationMarker.current = new mapboxgl.Marker({ element: destEl })
          .setLngLat(destCoords)
          .setPopup(new mapboxgl.Popup().setHTML('<strong>Delivery Location</strong><br/>' + order.delivery_address))
          .addTo(map.current);
      }

      // Fly to destination
      map.current.flyTo({
        center: destCoords,
        zoom: 14,
        duration: 1500
      });
    }
  }, [order?.delivery_latitude, order?.delivery_longitude]);

  // Update delivery partner marker
  useEffect(() => {
    if (!map.current || !deliveryLocation) return;

    const partnerCoords: [number, number] = [
      deliveryLocation.longitude, 
      deliveryLocation.latitude
    ];

    if (deliveryMarker.current) {
      deliveryMarker.current.setLngLat(partnerCoords);
    } else {
      // Create delivery partner marker element
      const partnerEl = document.createElement('div');
      partnerEl.className = 'delivery-marker';
      partnerEl.innerHTML = `
        <div style="
          background: linear-gradient(135deg, #F97316, #EA580C);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
          animation: pulse 2s infinite;
        ">
          <svg style="width: 24px; height: 24px; color: white;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
        </div>
      `;
      
      deliveryMarker.current = new mapboxgl.Marker({ element: partnerEl })
        .setLngLat(partnerCoords)
        .setPopup(new mapboxgl.Popup().setHTML('<strong>Delivery Partner</strong><br/>On the way!'))
        .addTo(map.current);
    }

    // If both markers exist, fit bounds to show both
    if (order?.delivery_latitude && order?.delivery_longitude) {
      const bounds = new mapboxgl.LngLatBounds()
        .extend(partnerCoords)
        .extend([Number(order.delivery_longitude), Number(order.delivery_latitude)]);
      
      map.current.fitBounds(bounds, {
        padding: 60,
        maxZoom: 15,
        duration: 1000
      });
    }
  }, [deliveryLocation, order?.delivery_latitude, order?.delivery_longitude]);

  const fetchOrderDetails = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (!error && data) {
      setOrder({
        ...data,
        status: data.status as OrderStatus,
      } as Order);
    }
  };

  const fetchOrderHistory = async () => {
    const { data, error } = await supabase
      .from('order_status_history')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setHistory(data.map(item => ({
        ...item,
        status: item.status as OrderStatus,
      })) as OrderStatusHistory[]);
    }
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      pending: Clock,
      confirmed: Package,
      preparing: Package,
      out_for_delivery: Truck,
      delivered: CheckCircle,
    };
    return icons[status] || Clock;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-gray-500',
      confirmed: 'text-blue-500',
      preparing: 'text-yellow-500',
      out_for_delivery: 'text-purple-500',
      delivered: 'text-green-500',
      cancelled: 'text-red-500',
    };
    return colors[status] || 'text-gray-500';
  };

  const calculateETA = () => {
    if (!order?.estimated_delivery_time) return null;
    const eta = new Date(order.estimated_delivery_time);
    const now = new Date();
    const diff = Math.max(0, Math.floor((eta.getTime() - now.getTime()) / 60000));
    return diff;
  };

  if (!order) return null;

  const eta = calculateETA();
  const isOutForDelivery = order.status === 'out_for_delivery';

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold mb-1">Order Tracking</h3>
          <p className="text-sm text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
        </div>
        {eta !== null && eta > 0 && (
          <Badge variant="secondary" className="text-base">
            <Clock className="w-4 h-4 mr-1" />
            {eta} mins
          </Badge>
        )}
      </div>

      {/* Live Map */}
      {mapboxToken && (
        <div className="mb-6 rounded-lg overflow-hidden border border-border">
          <div className="bg-muted px-4 py-2 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">
              {isOutForDelivery ? 'Live Tracking' : 'Delivery Location'}
            </span>
            {isOutForDelivery && deliveryLocation && (
              <Badge variant="default" className="ml-auto text-xs bg-green-500">
                <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                Live
              </Badge>
            )}
          </div>
          <div ref={mapContainer} className="w-full h-48" />
        </div>
      )}

      {/* Status Timeline */}
      <div className="space-y-4">
        {['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'].map(
          (status, index) => {
            const Icon = getStatusIcon(status);
            const isActive = order.status === status;
            const isPast = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered']
              .indexOf(order.status) >= index;
            const historyItem = history.find((h) => h.status === status);

            return (
              <div key={status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isPast ? 'bg-primary' : 'bg-muted'
                    } ${isActive ? 'ring-4 ring-primary/20' : ''}`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isPast ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}
                    />
                  </div>
                  {index < 4 && (
                    <div
                      className={`w-0.5 h-12 ${isPast ? 'bg-primary' : 'bg-muted'}`}
                    />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`font-semibold ${isActive ? getStatusColor(status) : ''}`}>
                        {status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                      {historyItem && (
                        <p className="text-sm text-muted-foreground">
                          {new Date(historyItem.created_at).toLocaleString()}
                        </p>
                      )}
                      {historyItem?.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{historyItem.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Delivery Location */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-start gap-2">
          <MapPin className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Delivery Location</p>
            <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
          </div>
        </div>
      </div>

      {/* Add CSS for marker animation */}
      <style>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(249, 115, 22, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0);
          }
        }
      `}</style>
    </Card>
  );
};

export default OrderTracking;
