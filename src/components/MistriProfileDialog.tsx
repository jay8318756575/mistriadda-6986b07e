
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mistri } from '@/types/mistri';
import { MapPin, Phone, Calendar, Star, MessageCircle, Award, Shield, Heart, Sparkles, Crown, Check } from 'lucide-react';

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
      <DialogContent className="max-w-lg overflow-hidden bg-white border-0 shadow-2xl">
        {/* Modern header with gradient */}
        <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 p-8 -m-6 mb-6 rounded-t-lg">
          {/* Floating particles */}
          <div className="absolute top-4 right-8 w-2 h-2 bg-white/60 rounded-full animate-ping"></div>
          <div className="absolute bottom-6 right-12 w-1 h-1 bg-white/80 rounded-full animate-pulse"></div>
          <div className="absolute top-12 left-8 w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce"></div>
          
          <DialogHeader className="text-center relative z-10">
            <DialogTitle className="text-3xl font-black text-white drop-shadow-lg">
              ✨ मिस्त्री प्रोफाइल ✨
            </DialogTitle>
          </DialogHeader>
          
          {/* Profile avatar */}
          <div className="text-center mt-6 relative z-10">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-white rounded-3xl blur-xl opacity-30 animate-pulse"></div>
              <div className="relative w-28 h-28 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl border-4 border-white/30">
                <span className="text-5xl font-black text-white drop-shadow-2xl">
                  {mistri.name.charAt(0)}
                </span>
                {/* Premium crown */}
                <div className="absolute -top-3 -right-2 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full p-2 shadow-xl border-2 border-white">
                  <Crown className="w-4 h-4 text-yellow-800" />
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <h2 className="text-3xl font-black text-white drop-shadow-lg">{mistri.name}</h2>
              <div className="flex items-center justify-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl border border-white/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white/90 capitalize">{mistri.category}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6 px-2">
          {/* Premium info cards with modern design */}
          <div className="grid grid-cols-1 gap-4">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative flex items-center space-x-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">स्थान</p>
                  <p className="text-lg font-black text-gray-800">{mistri.location}</p>
                </div>
                <Check className="w-5 h-5 text-green-500" />
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative flex items-center space-x-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">अनुभव</p>
                  <p className="text-lg font-black text-gray-800">{mistri.experience} साल का एक्सपर्ट</p>
                </div>
                <Check className="w-5 h-5 text-green-500" />
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative flex items-center space-x-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">संपर्क</p>
                  <p className="text-lg font-black text-gray-800">{mistri.mobile}</p>
                </div>
                <Check className="w-5 h-5 text-green-500" />
              </div>
            </div>
            
            {mistri.rating && (
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center space-x-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl shadow-lg">
                    <Star className="w-6 h-6 text-white fill-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">रेटिंग</p>
                    <p className="text-lg font-black text-gray-800">{mistri.rating} ⭐ (एक्सीलेंट)</p>
                  </div>
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              </div>
            )}
          </div>
          
          {/* Description with modern styling */}
          {mistri.description && (
            <div className="relative p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200 shadow-lg">
              <h4 className="font-black text-gray-800 mb-3 flex items-center text-lg">
                <Heart className="w-5 h-5 mr-3 text-red-500" />
                विशेषज्ञता
              </h4>
              <p className="text-gray-700 font-medium leading-relaxed">{mistri.description}</p>
            </div>
          )}
          
          {/* Trust badges with modern design */}
          <div className="flex items-center justify-center space-x-8 py-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200">
            <div className="flex flex-col items-center space-y-1">
              <div className="bg-green-500 p-2 rounded-full">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-bold text-gray-700">सत्यापित</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="bg-yellow-500 p-2 rounded-full">
                <Award className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-bold text-gray-700">प्रमाणित</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="bg-red-500 p-2 rounded-full">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-bold text-gray-700">भरोसेमंद</span>
            </div>
          </div>
          
          {/* Modern action buttons */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
              <Button 
                onClick={handleCall}
                className="relative w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black py-6 text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
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
                className="relative w-full border-2 border-green-500 text-green-700 hover:text-white hover:bg-gradient-to-r hover:from-green-600 hover:to-green-700 font-black py-6 text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 bg-white"
              >
                <MessageCircle className="w-5 h-5 mr-3" />
                💬 WhatsApp चैट
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MistriProfileDialog;
