import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, MapPin, User, ArrowLeft } from 'lucide-react';

const CustomerRegister = () => {
  const [formData, setFormData] = useState({
    location: '',
    bio: '',
    state: '',
    city: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal', 'Delhi'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.location || !formData.state || !formData.city) {
      toast.error('Location details are required');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const fullLocation = `${formData.city}, ${formData.state}`;

      const response = await fetch('/customer_register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          location: fullLocation,
          bio: formData.bio,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Customer profile created successfully!');
        navigate('/dashboard');
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Complete Your Profile</CardTitle>
            <CardDescription>
              Tell us about yourself to get personalized service recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Full Address</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Enter your full address"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This helps us show you nearby services
                  </p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  About You
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself and what services you're looking for..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    This helps service providers understand your needs better
                  </p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">What's Next?</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Browse available services in your area</li>
                  <li>• Connect with verified mistris and drivers</li>
                  <li>• Book services with transparent pricing</li>
                  <li>• Rate and review service providers</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerRegister;