import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Upload, Car, CreditCard, ArrowLeft } from 'lucide-react';

const DriverRegister = () => {
  const [formData, setFormData] = useState({
    licenseNumber: '',
    vehicleType: '',
    vehicleNumber: ''
  });
  const [licenseImage, setLicenseImage] = useState<File | null>(null);
  const [vehicleImage, setVehicleImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (type: 'license' | 'vehicle', file: File | null) => {
    if (type === 'license') {
      setLicenseImage(file);
    } else {
      setVehicleImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.licenseNumber || !formData.vehicleType || !formData.vehicleNumber) {
      toast.error('All fields are required');
      return;
    }

    if (!licenseImage) {
      toast.error('License image is required');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('license_number', formData.licenseNumber);
      formDataToSend.append('vehicle_type', formData.vehicleType);
      formDataToSend.append('vehicle_number', formData.vehicleNumber);
      formDataToSend.append('license_image', licenseImage);
      
      if (vehicleImage) {
        formDataToSend.append('vehicle_image', vehicleImage);
      }

      const response = await fetch('/driver_register.php', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Driver registration submitted! Awaiting approval.');
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
            <CardTitle className="text-2xl font-bold text-primary">Driver Registration</CardTitle>
            <CardDescription>
              Complete your driver profile to start receiving ride requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* License Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  License Information
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    type="text"
                    placeholder="Enter your license number"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseImage">License Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="licenseImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('license', e.target.files?.[0] || null)}
                      required
                    />
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload a clear photo of your driving license
                  </p>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select value={formData.vehicleType} onValueChange={(value) => handleInputChange('vehicleType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="auto">Auto Rickshaw</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="cab">Cab</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                  <Input
                    id="vehicleNumber"
                    type="text"
                    placeholder="Enter your vehicle number"
                    value={formData.vehicleNumber}
                    onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleImage">Vehicle Image (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="vehicleImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('vehicle', e.target.files?.[0] || null)}
                    />
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload a photo of your vehicle (optional but recommended)
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Important Notes:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your registration will be reviewed within 24-48 hours</li>
                  <li>• Make sure all information is accurate and up-to-date</li>
                  <li>• You'll be notified once your application is approved</li>
                  <li>• Valid documents are required for verification</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Registration
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverRegister;