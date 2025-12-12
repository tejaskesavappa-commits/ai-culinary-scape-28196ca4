import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import LampLogin from '../components/LampLogin';
import { supabase } from '@/integrations/supabase/client';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // First check if this is a restaurant owner trying to use customer login
      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (restaurant) {
        toast({
          title: "Restaurant Account",
          description: "This is a restaurant account. Please use the Restaurant Login instead.",
          variant: "destructive",
        });
        navigate('/restaurant-login');
        return;
      }

      // Proceed with customer login
      await signIn(email, password);
      navigate('/');
    } catch (error) {
      // Error is already handled by AuthContext with toast
    }
  };

  return (
    <LampLogin
      email={email}
      password={password}
      showPassword={showPassword}
      isLoading={loading}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onTogglePassword={() => setShowPassword(!showPassword)}
      onSubmit={handleSubmit}
    />
  );
};

export default Login;