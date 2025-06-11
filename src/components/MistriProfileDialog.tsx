
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mistri } from '@/types/mistri';
import { MapPin, Phone, Calendar, Star, MessageCircle } from 'lucide-react';

interface MistriProfileDialogProps {
  mistri: Mistri | null;
  isOpen: boolean;
  onClose: () => void;
}

const MistriProfileDialog = ({ mistri, isOpen, onClose }: MistriProfileDialogProps) => {
  if (!mistri) return null;

  const handleCall = () => {
    window.location.href = `tel:${mistri.mobile}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/91${mistri.mobile}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">मिस्त्री की जानकारी</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl font-bold text-orange-600">
                {mistri.name.charAt(0)}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{mistri.name}</h2>
            <p className="text-orange-600 font-medium capitalize">{mistri.category}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">{mistri.location}</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">{mistri.experience} साल का अनुभव</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">{mistri.mobile}</span>
            </div>
            
            {mistri.rating && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700">{mistri.rating} रेटिंग</span>
              </div>
            )}
          </div>
          
          {mistri.description && (
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-gray-700">{mistri.description}</p>
            </div>
          )}
          
          <div className="flex space-x-3">
            <Button 
              onClick={handleCall}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call करें
            </Button>
            <Button 
              onClick={handleWhatsApp}
              variant="outline"
              className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MistriProfileDialog;
