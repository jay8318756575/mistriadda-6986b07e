
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
import { Mistri } from '@/types/mistri';
import { supabase } from '@/integrations/supabase/client';

interface CreateProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated: (profile: Mistri) => void;
}

const CreateProfileDialog = ({ isOpen, onClose, onProfileCreated }: CreateProfileDialogProps) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Form data before validation:', formData);
    
    // Validate required fields
    if (!formData.name.trim()) {
      console.log('Validation failed: Name is empty');
      toast({
        title: "त्रुटि",
        description: "कृपया अपना नाम भरें",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.category) {
      console.log('Validation failed: Category not selected');
      toast({
        title: "त्रुटि",
        description: "कृपया काम का प्रकार चुनें",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.location) {
      console.log('Validation failed: Location not selected');
      toast({
        title: "त्रुटि",
        description: "कृपया अपना शहर चुनें",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.mobile.trim() || formData.mobile.length !== 10) {
      console.log('Validation failed: Mobile number invalid', formData.mobile);
      toast({
        title: "त्रुटि",
        description: "कृपया 10 अंकों का सही मोबाइल नंबर भरें",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.experience.trim() || parseInt(formData.experience) < 0) {
      console.log('Validation failed: Experience invalid', formData.experience);
      toast({
        title: "त्रुटि",
        description: "कृपया अनुभव भरें",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    console.log('=== ALL VALIDATIONS PASSED ===');
    console.log('Attempting to save to Supabase...');

    try {
      // Test database connection first
      console.log('Testing database connection...');
      const { data: testData, error: testError } = await supabase
        .from('mistris')
        .select('count(*)')
        .limit(1);
      
      if (testError) {
        console.error('Database connection test failed:', testError);
        throw new Error('Database connection failed: ' + testError.message);
      }
      
      console.log('Database connection successful. Test result:', testData);

      // Prepare data for insertion
      const insertData = {
        name: formData.name.trim(),
        category: formData.category,
        location: formData.location,
        mobile: formData.mobile.trim(),
        experience: parseInt(formData.experience),
        rating: Number((4.5 + Math.random() * 0.5).toFixed(1)), // Random rating between 4.5-5.0
        description: formData.description.trim() || null
      };

      console.log('Data to be inserted:', insertData);

      // Save to Supabase database
      const { data, error } = await supabase
        .from('mistris')
        .insert([insertData])
        .select()
        .single();

      console.log('Supabase insert response:', { data, error });

      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }

      if (data) {
        // Convert database response to Mistri type
        const newProfile: Mistri = {
          id: data.id,
          name: data.name,
          category: data.category,
          location: data.location,
          mobile: data.mobile,
          experience: data.experience,
          rating: data.rating,
          description: data.description
        };

        console.log('=== PROFILE CREATED SUCCESSFULLY ===');
        console.log('New profile from database:', newProfile);
        
        // Call the callback to add profile to the list
        onProfileCreated(newProfile);
        
        toast({
          title: "सफलता! 🎉",
          description: `${formData.name} जी, आपकी प्रोफाइल सफलतापूर्वक बन गई है!`,
        });
        
        // Reset form
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
        
        // Close dialog after showing success
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        console.error('No data returned from insert operation');
        throw new Error('No data returned from database');
      }
      
    } catch (error) {
      console.error('=== PROFILE CREATION FAILED ===');
      console.error('Full error object:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      toast({
        title: "त्रुटि",
        description: `प्रोफाइल बनाने में समस्या: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating ${field} with value:`, value);
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

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "त्रुटि",
          description: "वीडियो का साइज़ 50MB से कम होना चाहिए",
          variant: "destructive"
        });
        return;
      }
      setVideo(file);
      toast({
        title: "वीडियो चुना गया",
        description: file.name,
      });
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
              placeholder="जैसे: राम कुमार"
              className="border-orange-300 focus:border-orange-500 bg-white shadow-sm"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <Label htmlFor="category" className="text-orange-800 font-semibold">काम का प्रकार *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleInputChange('category', value)}
              disabled={isSubmitting}
            >
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
            <Select 
              value={formData.location} 
              onValueChange={(value) => handleInputChange('location', value)}
              disabled={isSubmitting}
            >
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
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                if (value.length <= 10) {
                  handleInputChange('mobile', value);
                }
              }}
              placeholder="9876543210"
              className="border-orange-300 focus:border-orange-500 bg-white shadow-sm"
              maxLength={10}
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">10 अंकों का नंबर (बिना +91 के)</p>
          </div>
          
          <div>
            <Label htmlFor="experience" className="text-orange-800 font-semibold">अनुभव (सालों में) *</Label>
            <Input
              id="experience"
              type="number"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              placeholder="जैसे: 5"
              className="border-orange-300 focus:border-orange-500 bg-white shadow-sm"
              min="0"
              max="50"
              required
              disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('photo')?.click()}
                className="w-full border-orange-300 hover:bg-orange-50 border-2 border-dashed"
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('video')?.click()}
                className="w-full border-orange-300 hover:bg-orange-50 border-2 border-dashed"
                disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
              disabled={isSubmitting}
            >
              रद्द करें
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
              disabled={isSubmitting}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isSubmitting ? 'बनाई जा रही है...' : 'प्रोफाइल बनाएं'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProfileDialog;
