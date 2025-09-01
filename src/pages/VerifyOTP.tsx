import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, RefreshCw } from 'lucide-react';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const navigate = useNavigate();
  const location = useLocation();
  
  const phone = location.state?.phone || '';
  const fromSignup = location.state?.fromSignup || false;

  useEffect(() => {
    if (!phone) {
      navigate('/login');
      return;
    }

    // Send OTP automatically when component mounts
    sendOTP();
  }, [phone]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const sendOTP = async () => {
    try {
      const response = await fetch('/firebase_otp.php?action=send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('OTP sent successfully!');
        if (data.debug_otp) {
          // For demo purposes - remove in production
          toast.info(`Demo OTP: ${data.debug_otp}`);
        }
      } else {
        toast.error(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/firebase_otp.php?action=verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Phone number verified successfully!');
        localStorage.removeItem('pendingVerification');
        
        if (fromSignup) {
          navigate('/complete-profile');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error(data.error || 'OTP verification failed');
        setOtp('');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    setCountdown(30);
    
    try {
      await sendOTP();
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold text-primary">Verify Phone</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to<br />
            <strong>{phone}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              onComplete={handleVerifyOTP}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button 
            onClick={handleVerifyOTP} 
            className="w-full" 
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify OTP
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendOTP}
              disabled={countdown > 0 || isResending}
            >
              {isResending && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              className="text-sm"
            >
              Use different phone number
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOTP;