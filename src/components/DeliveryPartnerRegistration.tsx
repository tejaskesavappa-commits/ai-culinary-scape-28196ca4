import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Truck } from 'lucide-react';

interface DeliveryPartnerRegistrationProps {
  onRegistrationComplete: () => void;
}

const DeliveryPartnerRegistration = ({ onRegistrationComplete }: DeliveryPartnerRegistrationProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleType: '',
    vehicleNumber: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vehicleType || !formData.vehicleNumber) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('delivery_partners')
      .insert({
        user_id: user?.id,
        vehicle_type: formData.vehicleType,
        vehicle_number: formData.vehicleNumber.toUpperCase(),
        is_available: false,
      });

    setLoading(false);

    if (error) {
      if (error.message.includes('new row violates row-level security')) {
        toast.error('You need the delivery partner role to register. Please contact an admin.');
      } else {
        toast.error('Failed to register. Please try again.');
      }
    } else {
      toast.success('Registration successful! Welcome to the delivery team.');
      onRegistrationComplete();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Truck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Delivery Partner Registration</h1>
          <p className="text-muted-foreground">
            Complete your profile to start accepting deliveries
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Select
              value={formData.vehicleType}
              onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
            >
              <SelectTrigger id="vehicleType">
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bike">Bike</SelectItem>
                <SelectItem value="Scooter">Scooter</SelectItem>
                <SelectItem value="Car">Car</SelectItem>
                <SelectItem value="Bicycle">Bicycle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleNumber">Vehicle Number</Label>
            <Input
              id="vehicleNumber"
              type="text"
              placeholder="e.g., MH01AB1234"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
              className="uppercase"
            />
            <p className="text-xs text-muted-foreground">
              Enter your vehicle registration number
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Registering...' : 'Complete Registration'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> You need to have the delivery partner role assigned by an admin. 
            If you see an error, please contact support.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default DeliveryPartnerRegistration;
