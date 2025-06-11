
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { categories } from '@/data/categories';
import { upCities } from '@/data/up-locations';
import { useToast } from '@/hooks/use-toast';
import { Camera, Video, Upload } from 'lucide-react';

interface CreateProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProfileDialog = ({ isOpen, onClose }: CreateProfileDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    mobile: '',
    experience: '',
    description: ''
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.location || !formData.mobile || !formData.experience) {
      toast({
        title: "Error",
        description: "कृपया सभी आवश्यक फील्ड भरें",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would typically save the profile to a database
    toast({
      title: "Success",
      description: "आपकी प्रोफाइल सफलतापूर्वक बन गई है!",
    });
    
    setFormData({
      name: '',
      category: '',
      location: '',
      mobile: '',
      experience: '',
      description: ''
    });
    setPhoto(null);
    setVideo(null);
    
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "Error",
          description: "वीडियो का साइज़ 50MB से कम होना चाहिए",
          variant: "destructive"
        });
        return;
      }
      setVideo(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-orange-50 to-yellow-50">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-orange-800">
            मिस्त्री प्रोफाइल बनाएं
          </DialogTitle>
          <p className="text-center text-gray-600">अपनी जानकारी भरें और काम पाना शुरू करें</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name" className="text-orange-800 font-semibold">पूरा नाम *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="अपना नाम लिखें"
              className="border-orange-300 focus:border-orange-500 bg-white shadow-sm"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="category" className="text-orange-800 font-semibold">काम का प्रकार *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className="border-orange-300 focus:border-orange-500 bg-white shadow-sm">
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
            <Label htmlFor="location" className="text-orange-800 font-semibold">शहर *</Label>
            <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
              <SelectTrigger className="border-orange-300 focus:border-orange-500 bg-white shadow-sm">
                <SelectValue placeholder="अपना शहर चुनें" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-48 overflow-y-auto">
                {upCities.map((city) => (
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
              onChange={(e) => handleInputChange('mobile', e.target.value)}
              placeholder="10 अंकों का नंबर"
              className="border-orange-300 focus:border-orange-500 bg-white shadow-sm"
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
              placeholder="कितने साल का अनुभव है"
              className="border-orange-300 focus:border-orange-500 bg-white shadow-sm"
              min="0"
              max="50"
              required
            />
          </div>

          {/* Photo Upload */}
          <div>
            <Label htmlFor="photo" className="text-orange-800 font-semibold">फोटो अपलोड करें</Label>
            <div className="mt-2">
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('photo')?.click()}
                className="w-full border-orange-300 hover:bg-orange-50 border-2 border-dashed"
              >
                <Camera className="w-4 h-4 mr-2" />
                {photo ? photo.name : 'अपनी फोटो चुनें'}
              </Button>
            </div>
          </div>

          {/* Video Upload */}
          <div>
            <Label htmlFor="video" className="text-orange-800 font-semibold">काम का वीडियो (1 मिनट)</Label>
            <div className="mt-2">
              <input
                id="video"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('video')?.click()}
                className="w-full border-orange-300 hover:bg-orange-50 border-2 border-dashed"
              >
                <Video className="w-4 h-4 mr-2" />
                {video ? video.name : 'अपना काम दिखाने वाला वीडियो चुनें'}
              </Button>
              <p className="text-xs text-gray-500 mt-1">अधिकतम 50MB, 1 मिनट का वीडियो</p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description" className="text-orange-800 font-semibold">काम का विवरण</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="अपने काम के बारे में बताएं..."
              className="border-orange-300 focus:border-orange-500 bg-white shadow-sm"
              rows={3}
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              रद्द करें
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Upload className="w-4 h-4 mr-2" />
              प्रोफाइल बनाएं
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProfileDialog;
