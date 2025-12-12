import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Store, MapPin, Phone, Mail, Clock, Upload, ChefHat, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const restaurantSchema = z.object({
  name: z.string().min(2, 'Restaurant name must be at least 2 characters'),
  ownerName: z.string().min(2, 'Owner name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(10, 'Please enter a complete address'),
  cuisineType: z.string().min(1, 'Please select a cuisine type'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  openingTime: z.string().min(1, 'Please enter opening time'),
  closingTime: z.string().min(1, 'Please enter closing time'),
  avgDeliveryTime: z.string().min(1, 'Please select average delivery time'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RestaurantFormData = z.infer<typeof restaurantSchema>;

const cuisineTypes = [
  'Indian',
  'Chinese',
  'Italian',
  'Mexican',
  'Japanese',
  'Thai',
  'American',
  'Mediterranean',
  'French',
  'Korean',
  'Other',
];

const deliveryTimes = [
  '15-20 mins',
  '20-30 mins',
  '30-45 mins',
  '45-60 mins',
];

const RestaurantRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: '',
      ownerName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: '',
      cuisineType: '',
      description: '',
      openingTime: '',
      closingTime: '',
      avgDeliveryTime: '',
    },
  });

  const onSubmit = async (data: RestaurantFormData) => {
    setIsSubmitting(true);
    try {
      // Create user account with Supabase Auth
      const redirectUrl = `${window.location.origin}/restaurant-login`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            owner_name: data.ownerName,
            restaurant_name: data.name,
            user_type: 'restaurant_owner',
          }
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Submit to Formspree
      const formData = new FormData();
      formData.append('form_type', 'Restaurant Registration');
      formData.append('restaurant_name', data.name);
      formData.append('owner_name', data.ownerName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
      formData.append('cuisine_type', data.cuisineType);
      formData.append('description', data.description);
      formData.append('opening_time', data.openingTime);
      formData.append('closing_time', data.closingTime);
      formData.append('avg_delivery_time', data.avgDeliveryTime);

      const response = await fetch('https://formspree.io/f/mqarybyq', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to submit registration');
      }

      // Also save to Supabase for tracking - auto-approve so restaurants appear immediately
      const { error: insertError } = await supabase
        .from('restaurants')
        .insert({
          name: data.name,
          owner_name: data.ownerName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          cuisine_type: data.cuisineType,
          description: data.description,
          opening_time: data.openingTime,
          closing_time: data.closingTime,
          avg_delivery_time: data.avgDeliveryTime,
          is_approved: true,
        });

      if (insertError) {
        console.error('Error saving to database:', insertError);
        // Continue even if DB save fails since Formspree succeeded
      }
      
      toast({
        title: 'Registration Successful!',
        description: 'Your restaurant is now live! Customers can start ordering.',
      });
      
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6">
            <ChefHat className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Partner with FOODIEXPRESS
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of restaurants already growing their business with us. 
            Reach more customers and increase your revenue.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center border-border">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Expand Your Reach</h3>
                <p className="text-sm text-muted-foreground">Access millions of customers ordering food daily</p>
              </CardContent>
            </Card>
            <Card className="text-center border-border">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Easy Management</h3>
                <p className="text-sm text-muted-foreground">Simple dashboard to manage orders and menu</p>
              </CardContent>
            </Card>
            <Card className="text-center border-border">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Reliable Delivery</h3>
                <p className="text-sm text-muted-foreground">Our delivery partners ensure timely delivery</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-border shadow-elegant">
            <CardHeader>
              <CardTitle className="text-2xl">Restaurant Registration</CardTitle>
              <CardDescription>
                Fill in your restaurant details to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Restaurant Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Your Restaurant" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ownerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Owner Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="email@restaurant.com" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="+91 9876543210" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                className="pl-10 pr-10" 
                                {...field} 
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                className="pl-10 pr-10" 
                                {...field} 
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restaurant Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea placeholder="Complete address with landmark" className="pl-10 min-h-[80px]" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cuisineType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cuisine Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select cuisine" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cuisineTypes.map((cuisine) => (
                                <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                                  {cuisine}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="avgDeliveryTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Average Delivery Time</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {deliveryTimes.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="openingTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opening Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="closingTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Closing Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About Your Restaurant</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your restaurant, specialties, and what makes you unique..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default RestaurantRegistration;
