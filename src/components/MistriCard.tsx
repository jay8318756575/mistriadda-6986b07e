
import { Mistri } from '@/types/mistri';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Star, Calendar, Sparkles, Award, Shield, Heart, Check } from 'lucide-react';

interface MistriCardProps {
  mistri: Mistri;
  onViewDetails: (mistri: Mistri) => void;
  proximityScore?: number; // New prop to show proximity indicator
}

const MistriCard = ({ mistri, onViewDetails, proximityScore }: MistriCardProps) => {
  return (
    <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white border-0 shadow-lg transform hover:scale-[1.02] group">
      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Floating elements */}
      <div className="absolute top-3 right-3 w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-60 animate-ping transition-opacity duration-300"></div>
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-80 animate-pulse transition-opacity duration-300"></div>
      
      <div className="relative p-6">
        <div className="flex items-start space-x-5">
          {/* Modern avatar */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl font-black text-white drop-shadow-lg">
                {mistri.name.charAt(0)}
              </span>
              {/* Verified badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-1.5 shadow-lg">
                <Check className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            {/* Name and rating */}
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xl text-gray-800 group-hover:text-orange-700 transition-colors duration-300">
                {mistri.name}
              </h3>
              {mistri.rating && (
                <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1.5 rounded-full shadow-lg">
                  <Star className="w-4 h-4 fill-white text-white" />
                  <span className="text-sm font-bold text-white">{mistri.rating}</span>
                </div>
              )}
            </div>
            
            {/* Category with modern styling */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2.5 rounded-xl shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-orange-700 font-black capitalize text-lg">{mistri.category}</span>
            </div>
            
            {/* Info cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-3 border border-gray-100 hover:shadow-md transition-shadow">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span className="text-gray-700 font-semibold text-sm">{mistri.location}</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-3 border border-gray-100 hover:shadow-md transition-shadow">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 font-semibold text-sm">{mistri.experience} वर्ष</span>
              </div>
            </div>
            
            {/* Proximity indicator */}
            {proximityScore !== undefined && proximityScore > 0.3 && (
              <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-bold text-sm">
                  📍 आपके नजदीक - {Math.round(proximityScore * 100)}% मैच
                </span>
              </div>
            )}
            
            {/* Description */}
            {mistri.description && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
                <p className="text-sm text-gray-700 font-medium leading-relaxed">{mistri.description}</p>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex space-x-3 pt-2">
              <div className="relative group/btn flex-1">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur opacity-30 group-hover/btn:opacity-50 transition-opacity"></div>
                <Button 
                  variant="outline" 
                  onClick={() => onViewDetails(mistri)}
                  className="relative w-full border-2 border-orange-400 text-orange-700 hover:text-white font-bold hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  विवरण देखें
                </Button>
              </div>
              
              <div className="relative group/btn flex-1">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur opacity-40 group-hover/btn:opacity-60 transition-opacity"></div>
                <Button 
                  onClick={() => window.location.href = `tel:${mistri.phone || mistri.mobile}`}
                  className="relative w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-bold transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  📞 कॉल करें
                </Button>
              </div>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center space-x-6 pt-3 border-t border-gray-100">
              <div className="flex flex-col items-center space-y-1">
                <div className="bg-green-500 p-1.5 rounded-full">
                  <Shield className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-600">सत्यापित</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="bg-yellow-500 p-1.5 rounded-full">
                  <Award className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-600">प्रमाणित</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="bg-red-500 p-1.5 rounded-full">
                  <Heart className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-600">भरोसेमंद</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MistriCard;
