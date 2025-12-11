import React, { useEffect, useState } from 'react';
import { Smartphone, QrCode, ExternalLink, Copy, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import QRCode from 'qrcode';
import phonePeQR from '../assets/phonepe-qr-reference.jpeg';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentDetailsProps {
  total: number;
  orderId?: string;
  onPaymentComplete: () => void;
  onBack: () => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ total, orderId, onPaymentComplete, onBack }) => {
  const [transactionRef, setTransactionRef] = useState('');
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'awaiting_reference' | 'submitting' | 'submitted' | 'success'>('pending');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const merchantUPI = '9951577276@ybl';
  const merchantName = 'FOODIEXPRESS';
  
  const upiApps = [
    { 
      id: 'gpay', 
      name: 'Google Pay', 
      logo: '🔵',
      deepLink: `gpay://upi/pay?pa=${merchantUPI}&pn=${encodeURIComponent(merchantName)}&am=${total}&cu=INR`
    },
    { 
      id: 'phonepe', 
      name: 'PhonePe', 
      logo: '🟣',
      deepLink: `phonepe://pay?pa=${merchantUPI}&pn=${encodeURIComponent(merchantName)}&am=${total}&cu=INR`
    },
    { 
      id: 'paytm', 
      name: 'Paytm', 
      logo: '🔵',
      deepLink: `paytmmp://pay?pa=${merchantUPI}&pn=${encodeURIComponent(merchantName)}&am=${total}&cu=INR`
    },
    { 
      id: 'amazonpay', 
      name: 'Amazon Pay', 
      logo: '🟠',
      deepLink: `amazonpay://pay?pa=${merchantUPI}&pn=${encodeURIComponent(merchantName)}&am=${total}&cu=INR`
    }
  ];

  const generateUPIString = () => `upi://pay?pa=${merchantUPI}&pn=${encodeURIComponent(merchantName)}&am=${total}&cu=INR&tn=${encodeURIComponent('Order Payment')}`;

  useEffect(() => {
    const upi = generateUPIString();
    QRCode.toDataURL(upi, { width: 512, margin: 1 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [total]);

  const handleUPIAppPayment = (deepLink: string) => {
    window.open(deepLink, '_blank');
    setPaymentStatus('awaiting_reference');
  };

  const copyUPIId = () => {
    navigator.clipboard.writeText(merchantUPI);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitReference = async () => {
    if (!transactionRef.trim()) {
      toast({
        title: "Error",
        description: "Please enter your UPI transaction reference/ID",
        variant: "destructive",
      });
      return;
    }

    if (!orderId) {
      toast({
        title: "Error",
        description: "Order ID not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setPaymentStatus('submitting');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Error",
          description: "Please log in to continue",
          variant: "destructive",
        });
        setPaymentStatus('awaiting_reference');
        return;
      }

      const { data, error } = await supabase.functions.invoke('verify-upi-payment', {
        body: {
          order_id: orderId,
          transaction_reference: transactionRef.trim(),
          action: 'submit_reference'
        }
      });

      if (error) {
        console.error('Error submitting payment reference:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to submit payment reference",
          variant: "destructive",
        });
        setPaymentStatus('awaiting_reference');
        return;
      }

      if (data?.success) {
        setPaymentStatus('submitted');
        toast({
          title: "Reference Submitted",
          description: "Your payment reference has been submitted for verification",
        });
        setTimeout(() => {
          onPaymentComplete();
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: data?.error || "Failed to submit payment reference",
          variant: "destructive",
        });
        setPaymentStatus('awaiting_reference');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setPaymentStatus('awaiting_reference');
    }
  };

  const handlePaidClick = () => {
    setPaymentStatus('awaiting_reference');
  };

  if (paymentStatus === 'submitting') {
    return (
      <div className="space-y-6 text-center">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← Back to Cart
          </Button>
          <h2 className="text-2xl font-bold text-foreground">Verifying Payment</h2>
        </div>
        
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Submitting payment reference...</p>
            <p className="text-sm text-muted-foreground mt-2">Please don't close this window</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'submitted' || paymentStatus === 'success') {
    return (
      <div className="space-y-6 text-center">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-foreground">Payment Reference Submitted!</h2>
        </div>
        
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-lg font-medium">₹{total} payment submitted</p>
            <p className="text-sm text-muted-foreground mt-2">Your payment will be verified shortly</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'awaiting_reference') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => setPaymentStatus('pending')}>
            ← Back
          </Button>
          <h2 className="text-2xl font-bold text-foreground">Confirm Payment</h2>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Enter Payment Reference
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                After completing the UPI payment, enter your transaction reference/UTR number to confirm your order.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="transaction-ref">UPI Transaction Reference / UTR Number</Label>
              <Input
                id="transaction-ref"
                placeholder="e.g., 412345678901"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You can find this in your UPI app's transaction history
              </p>
            </div>

            <div className="bg-muted p-3 rounded-lg text-sm">
              <p className="font-medium">Amount: ₹{total}</p>
              <p className="text-muted-foreground">Paid to: {merchantUPI}</p>
            </div>

            <Button 
              onClick={handleSubmitReference}
              disabled={!transactionRef.trim()}
              className="w-full"
            >
              Confirm Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Back to Cart
        </Button>
        <h2 className="text-2xl font-bold text-foreground">UPI Payment</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* QR Code Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Scan QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-6">
              <div className="bg-gradient-to-b from-purple-600 to-purple-800 text-white p-6 rounded-xl">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-lg">₹</span>
                  </div>
                  <h3 className="text-xl font-bold">UPI PAYMENT</h3>
                </div>
                <div className="text-purple-200 text-sm mb-4">ACCEPTED HERE</div>
                <div className="text-white text-lg mb-6">Scan & Pay Using Any UPI App</div>
                
                <div className="bg-white p-4 rounded-lg mx-auto w-fit">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`UPI QR for ${merchantUPI}`}
                      className="w-48 h-48 mx-auto object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <img 
                      src={phonePeQR} 
                      alt="Fallback UPI QR"
                      className="w-48 h-48 mx-auto object-contain"
                    />
                  )}
                </div>
                
                <div className="mt-6 text-white font-medium">
                  ₹{total} - {merchantName}
                </div>
                <div className="text-purple-200 text-sm">
                  📲 Works with PhonePe, Google Pay, Paytm, BHIM & all UPI apps
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 p-3 bg-accent rounded-lg">
                <span className="text-sm font-mono">{merchantUPI}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyUPIId}
                  className="p-1 h-auto"
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <Button onClick={handlePaidClick} className="w-full">
                I've Made the Payment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* UPI Apps Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Pay with UPI Apps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                {upiApps.map((app) => (
                  <Button
                    key={app.id}
                    variant="outline"
                    className="w-full justify-between h-auto p-4"
                    onClick={() => handleUPIAppPayment(app.deepLink)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{app.logo}</span>
                      <span className="font-medium">{app.name}</span>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <span className="text-lg">Total Amount:</span>
            <span className="text-2xl font-bold text-primary">₹{total}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
            <Check className="h-4 w-4" />
            <span>Secure UPI Payment • Server-Side Verification</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentDetails;
