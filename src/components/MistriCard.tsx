
import { Mistri } from '@/types/mistri';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Star, Calendar } from 'lucide-react';

interface MistriCardProps {
  mistri: Mistri;
  onViewDetails: (mistri: Mistri) => void;
}

const MistriCard = ({ mistri, onViewDetails }: MistriCardProps) => {
  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-300 bg-white border-orange-200">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-orange-600">
            {mistri.name.charAt(0)}
          </span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-800">{mistri.name}</h3>
            {mistri.rating && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">{mistri.rating}</span>
              </div>
            )}
          </div>
          
          <p className="text-orange-600 font-medium capitalize mb-2">{mistri.category}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{mistri.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{mistri.experience} years</span>
            </div>
          </div>
          
          {mistri.description && (
            <p className="text-sm text-gray-600 mb-3">{mistri.description}</p>
          )}
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails(mistri)}
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              View Details
            </Button>
            <Button 
              size="sm"
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Phone className="w-4 h-4 mr-1" />
              Call
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MistriCard;
