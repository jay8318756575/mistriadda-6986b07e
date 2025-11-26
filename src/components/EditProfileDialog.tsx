import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { categories } from '@/data/categories';
import { indiaLocations } from '@/data/india-locations';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { Mistri } from '@/types/mistri';
import { phpClient } from '@/lib/php-client';

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mistri: Mistri;
  onProfileUpdated: (profile: Mistri) => void;
}

const EditProfileDialog = ({ isOpen, onClose, mistri, onProfileUpdated }: EditProfileDialogProps) => {
  const [formData, setFormData] = useState({
    name: mistri.name,
    category: mistri.category,
    state: '',
    city: '',
    location: mistri.location,
    mobile: mistri.mobile || mistri.phone || '',
    experience: mistri.experience?.toString() || '',
    description: mistri.description || '',
    address: mistri.address || ''
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Parse location to extract state and city if possible
    if (mistri.location) {
      const parts = mistri.location.split(',').map(s => s.trim());
      if (parts.length >= 2) {
        setFormData(prev => ({
          ...prev,
          city: parts[0],
          state: parts[1]
        }));
      }
    }
  }, [mistri]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      toast({
        title: "फोटो चुनी गई",
        description: file.name,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let profileImageUrl = mistri.profile_photo_url || '';

      // Upload new photo if selected
      if (photo) {
        const photoFormData = new FormData();
        photoFormData.append('photo', photo);
        photoFormData.append('mistri_id', mistri.id);

        const photoResult = await phpClient.uploadProfilePhoto(mistri.id, photoFormData);
        
        if (photoResult.success && photoResult.data) {
          profileImageUrl = photoResult.data.url;
        }
      }

      // Update profile data
      const profileData = {
        id: mistri.id,
        name: formData.name.trim(),
        phone: formData.mobile.trim(),
        location: formData.location,
        category: formData.category,
        experience_years: parseInt(formData.experience),
        description: formData.description.trim(),
        profile_image: profileImageUrl,
        address: formData.address.trim()
      };

      const result = await phpClient.saveProfile(profileData);

      if (!result.success) {
        throw new Error(result.error || 'Profile update failed');
      }

      const updatedProfile: Mistri = {
        ...mistri,
        name: formData.name,
        category: formData.category,
        location: formData.location,
        mobile: formData.mobile,
        experience: parseInt(formData.experience),
        description: formData.description,
        address: formData.address,
        profile_photo_url: profileImageUrl
      };

      toast({
        title: "सफलता! 🎉",
        description: "आपकी प्रोफाइल अपडेट हो गई है!",
      });

      onProfileUpdated(updatedProfile);
      onClose();

    } catch (error) {
      console.error('Profile update failed:', error);
      toast({
        title: "त्रुटि",
        description: "प्रोफाइल अपडेट करने में समस्या हुई।",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-orange-50 to-red-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-800">
            प्रोफाइल एडिट करें
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name" className="text-orange-800 font-semibold">पूरा नाम *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="जैसे: राम कुमार"
              className="border-orange-300 focus:border-orange-500 bg-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-orange-800 font-semibold">काम का प्रकार *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger className="border-orange-300 focus:border-orange-500 bg-white">
                <SelectValue placeholder="अपना काम चुनें" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} ({category.nameHindi})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="state" className="text-orange-800 font-semibold">राज्य *</Label>
            <Select 
              value={formData.state} 
              onValueChange={(value) => {
                handleInputChange('state', value);
                handleInputChange('city', '');
                handleInputChange('location', '');
              }}
            >
              <SelectTrigger className="border-orange-300 focus:border-orange-500 bg-white">
                <SelectValue placeholder="अपना राज्य चुनें" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-48 overflow-y-auto">
                {indiaLocations.states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="city" className="text-orange-800 font-semibold">शहर *</Label>
            <Select 
              value={formData.city} 
              onValueChange={(value) => {
                handleInputChange('city', value);
                handleInputChange('location', `${value}, ${formData.state}`);
              }}
              disabled={!formData.state}
            >
              <SelectTrigger className="border-orange-300 focus:border-orange-500 bg-white">
                <SelectValue placeholder={formData.state ? "अपना शहर चुनें" : "पहले राज्य चुनें"} />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-48 overflow-y-auto">
                {formData.state && indiaLocations.cities[formData.state]?.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="mobile" className="text-orange-800 font-semibold">मोबाइल नंबर *</Label>
            <Input
              id="mobile"
              type="tel"
              value={formData.mobile}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 10) {
                  handleInputChange('mobile', value);
                }
              }}
              placeholder="9876543210"
              className="border-orange-300 focus:border-orange-500 bg-white"
              maxLength={10}
              required
            />
          </div>

          <div>
            <Label htmlFor="experience" className="text-orange-800 font-semibold">अनुभव (सालों में) *</Label>
            <Input
              id="experience"
              type="number"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              className="border-orange-300 focus:border-orange-500 bg-white"
              min="0"
              max="50"
              required
            />
          </div>

          <div>
            <Label htmlFor="address" className="text-orange-800 font-semibold">पूरा पता *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="मकान नंबर, गली, मोहल्ला"
              className="border-orange-300 focus:border-orange-500 bg-white"
              rows={2}
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-orange-800 font-semibold">अपने बारे में</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="अपने काम के बारे में बताएं..."
              className="border-orange-300 focus:border-orange-500 bg-white"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="photo" className="text-orange-800 font-semibold">प्रोफाइल फोटो अपडेट करें</Label>
            <div className="mt-2 flex items-center gap-3">
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <label htmlFor="photo" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 rounded-lg border-2 border-orange-300 transition-colors">
                  <Camera className="w-5 h-5 text-orange-600" />
                  <span className="text-orange-800 font-semibold">फोटो चुनें</span>
                </div>
              </label>
              {photo && (
                <span className="text-sm text-green-600 font-medium">✓ {photo.name}</span>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              रद्द करें
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  सेव हो रहा है...
                </>
              ) : (
                'सेव करें'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
