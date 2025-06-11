
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { categories } from '@/data/categories';
import { useToast } from '@/hooks/use-toast';

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
    
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">मिस्त्री प्रोफाइल बनाएं</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">पूरा नाम *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="अपना नाम लिखें"
              className="border-orange-200 focus:border-orange-400"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="category">काम का प्रकार *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className="border-orange-200 focus:border-orange-400">
                <SelectValue placeholder="अपना काम चुनें" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} ({category.nameHindi})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="location">स्थान *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="शहर का नाम"
              className="border-orange-200 focus:border-orange-400"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="mobile">मोबाइल नंबर *</Label>
            <Input
              id="mobile"
              type="tel"
              value={formData.mobile}
              onChange={(e) => handleInputChange('mobile', e.target.value)}
              placeholder="10 अंकों का नंबर"
              className="border-orange-200 focus:border-orange-400"
              maxLength={10}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="experience">अनुभव (सालों में) *</Label>
            <Input
              id="experience"
              type="number"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              placeholder="कितने साल का अनुभव है"
              className="border-orange-200 focus:border-orange-400"
              min="0"
              max="50"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">काम का विवरण</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="अपने काम के बारे में बताएं..."
              className="border-orange-200 focus:border-orange-400"
              rows={3}
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              रद्द करें
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              प्रोफाइल बनाएं
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProfileDialog;
