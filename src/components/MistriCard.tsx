
import { Mistri } from '@/types/mistri';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Star, Calendar, Sparkles, Award, Shield, Heart } from 'lucide-react';

interface MistriCardProps {
  mistri: Mistri;
  onViewDetails: (mistri: Mistri) => void;
}

const MistriCard = ({ mistri, onViewDetails }: MistriCardProps) => {
  return (
    <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-blue-50 to-purple-50 border-2 border-transparent hover:border-purple-300 transform hover:scale-[1.02] group">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Floating particles */}
      <div className="absolute top-2 right-2 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-60 animate-ping transition-opacity duration-300"></div>
      <div className="absolute bottom-3 left-3 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-80 animate-pulse transition-opacity duration-300"></div>
      
      <div className="relative p-6">
        <div className="flex items-start space-x-5">
          {/* Premium Avatar */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl font-black text-white drop-shadow-lg">
                {mistri.name.charAt(0)}
              </span>
              {/* Premium badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1 shadow-lg">
                <Award className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-3">
            {/* Name and rating */}
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xl text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                {mistri.name}
              </h3>
              {mistri.rating && (
                <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full shadow-lg">
                  <Star className="w-4 h-4 fill-white text-white" />
                  <span className="text-sm font-bold text-white">{mistri.rating}</span>
                </div>
              )}
            </div>
            
            {/* Category with icon */}
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-purple-700 font-bold capitalize text-lg">{mistri.category}</span>
            </div>
            
            {/* Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-lg p-2 border border-purple-200">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span className="text-gray-700 font-medium">{mistri.location}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-lg p-2 border border-blue-200">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 font-medium">{mistri.experience} वर्ष</span>
              </div>
            </div>
            
            {/* Description */}
            {mistri.description && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-700 font-medium">{mistri.description}</p>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex space-x-3 pt-2">
              <div className="relative group/btn flex-1">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur opacity-30 group-hover/btn:opacity-60 transition-opacity"></div>
                <Button 
                  variant="outline" 
                  onClick={() => onViewDetails(mistri)}
                  className="relative w-full border-2 border-purple-300 text-purple-700 hover:text-white font-bold hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  विवरण देखें
                </Button>
              </div>
              
              <div className="relative group/btn flex-1">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur opacity-40 group-hover/btn:opacity-70 transition-opacity"></div>
                <Button 
                  className="relative w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-bold transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  📞 कॉल करें
                </Button>
              </div>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center space-x-4 pt-2 border-t border-purple-200">
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <Shield className="w-3 h-3 text-green-500" />
                <span className="font-medium">सत्यापित</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <Award className="w-3 h-3 text-yellow-500" />
                <span className="font-medium">प्रमाणित</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <Heart className="w-3 h-3 text-red-500" />
                <span className="font-medium">भरोसेमंद</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MistriCard;
