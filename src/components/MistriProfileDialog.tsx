
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mistri } from '@/types/mistri';
import { MapPin, Phone, Calendar, Star, MessageCircle, Award, Shield, Heart, Sparkles, Crown } from 'lucide-react';

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
      <DialogContent className="max-w-lg overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border-2 border-purple-300 shadow-2xl">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-pink-600/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
        
        {/* Floating particles */}
        <div className="absolute top-4 right-8 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-8 right-12 w-1 h-1 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute top-12 left-8 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
        
        <div className="relative z-10">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-3xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
              ✨ मिस्त्री प्रोफाइल ✨
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Premium Profile Header */}
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative w-28 h-28 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform hover:scale-110 transition-transform duration-300">
                  <span className="text-5xl font-black text-white drop-shadow-2xl">
                    {mistri.name.charAt(0)}
                  </span>
                  {/* Crown badge */}
                  <div className="absolute -top-3 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 shadow-xl">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-800">{mistri.name}</h2>
                <div className="flex items-center justify-center space-x-2">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-purple-700 capitalize">{mistri.category}</span>
                </div>
              </div>
            </div>
            
            {/* Premium Info Cards */}
            <div className="grid grid-cols-1 gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 shadow-lg">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-xl">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">स्थान</p>
                    <p className="text-lg font-bold text-gray-800">{mistri.location}</p>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-green-200 shadow-lg">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">अनुभव</p>
                    <p className="text-lg font-bold text-gray-800">{mistri.experience} साल का एक्सपर्ट</p>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200 shadow-lg">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">संपर्क</p>
                    <p className="text-lg font-bold text-gray-800">{mistri.mobile}</p>
                  </div>
                </div>
              </div>
              
              {mistri.rating && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-yellow-200 shadow-lg">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl">
                      <Star className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">रेटिंग</p>
                      <p className="text-lg font-bold text-gray-800">{mistri.rating} ⭐ (एक्सीलेंट)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Description */}
            {mistri.description && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-2xl blur"></div>
                <div className="relative p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-200">
                  <h4 className="font-bold text-purple-700 mb-2 flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    विशेषज्ञता
                  </h4>
                  <p className="text-gray-700 font-medium">{mistri.description}</p>
                </div>
              </div>
            )}
            
            {/* Trust badges */}
            <div className="flex items-center justify-center space-x-6 py-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm font-bold text-gray-700">सत्यापित</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-bold text-gray-700">प्रमाणित</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm font-bold text-gray-700">भरोसेमंद</span>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
                <Button 
                  onClick={handleCall}
                  className="relative w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Phone className="w-5 h-5 mr-3" />
                  📞 तुरंत कॉल करें
                </Button>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
                <Button 
                  onClick={handleWhatsApp}
                  variant="outline"
                  className="relative w-full border-2 border-green-500 text-green-700 hover:text-white hover:bg-gradient-to-r hover:from-green-600 hover:to-green-700 font-bold py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  💬 WhatsApp चैट
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MistriProfileDialog;
