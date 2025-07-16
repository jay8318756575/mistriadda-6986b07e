
import { Category } from '@/types/mistri';
import { Card } from '@/components/ui/card';
import { 
  Zap, Wrench, Paintbrush, Hammer, Settings, 
  Flame, Leaf, Sparkles, Car, Shield, ChefHat, Home, Recycle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Import all category icons
import electricianIcon from '@/assets/electrician-icon.png';
import plumberIcon from '@/assets/plumber-icon.png';
import painterIcon from '@/assets/painter-icon.png';
import carpenterIcon from '@/assets/carpenter-icon.png';
import masonIcon from '@/assets/mason-icon.png';
import mechanicIcon from '@/assets/mechanic-icon.png';
import kabadiIcon from '@/assets/kabadi-icon.png';
import welderWork from '@/assets/welder-work.jpg';
import gardenerWork from '@/assets/gardener-work.jpg';
import cleanerWork from '@/assets/cleaner-work.jpg';
import driverWork from '@/assets/driver-work.jpg';
import securityWork from '@/assets/security-work.jpg';
import cookWork from '@/assets/cook-work.jpg';
import propertyWork from '@/assets/property-work.jpg';

const iconMap = {
  Zap, Wrench, Paintbrush, Hammer, Settings,
  Flame, Leaf, Sparkles, Car, Shield, ChefHat, Home, Recycle,
  Brick: Hammer // Fallback for brick (mason uses hammer icon)
};

const iconImageMap: Record<string, string> = {
  'electrician': electricianIcon,
  'plumber': plumberIcon,
  'painter': painterIcon,
  'carpenter': carpenterIcon,
  'mason': masonIcon,
  'mechanic': mechanicIcon,
  'kabadi': kabadiIcon,
  'welder': welderWork,
  'gardener': gardenerWork,
  'cleaner': cleanerWork,
  'driver': driverWork,
  'security': securityWork,
  'cook': cookWork,
  'property': propertyWork,
};

const gradientMap: Record<string, string> = {
  'electrician': 'from-yellow-400 via-orange-500 to-red-500',
  'plumber': 'from-blue-400 via-cyan-500 to-teal-500',
  'carpenter': 'from-amber-400 via-orange-500 to-red-600',
  'painter': 'from-pink-400 via-purple-500 to-indigo-500',
  'mechanic': 'from-gray-400 via-slate-500 to-zinc-600',
  'mason': 'from-orange-400 via-red-500 to-pink-500',
  'welder': 'from-red-400 via-orange-500 to-yellow-500',
  'gardener': 'from-green-400 via-emerald-500 to-teal-500',
  'cleaner': 'from-pink-400 via-rose-500 to-red-500',
  'cook': 'from-orange-400 via-amber-500 to-yellow-500',
  'driver': 'from-blue-400 via-indigo-500 to-purple-500',
  'security': 'from-gray-400 via-slate-500 to-gray-600',
  'property': 'from-green-400 via-blue-500 to-indigo-500',
  'kabadi': 'from-amber-400 via-orange-500 to-red-500'
};

interface CategoryCardProps {
  category: Category;
  onClick: (categoryId: string) => void;
  className?: string;
}

const CategoryCard = ({ category, onClick, className }: CategoryCardProps) => {
  const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Settings;
  const gradient = gradientMap[category.id] || 'from-blue-400 via-purple-500 to-pink-500';
  const categoryIcon = iconImageMap[category.id];

  return (
    <Card 
      className={cn(
        "relative group cursor-pointer overflow-hidden bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-rotate-1",
        className
      )}
      onClick={() => onClick(category.id)}
    >
      {/* Animated background overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
      
      {/* Floating elements */}
      <div className="absolute top-2 right-2 w-1 h-1 bg-white/60 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute bottom-3 left-3 w-0.5 h-0.5 bg-white/80 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative p-8 text-center space-y-4 bg-white/80 backdrop-blur-sm group-hover:bg-white/90 transition-all duration-300">
        {/* Category Icon */}
        <div className="relative mx-auto w-24 h-24">
          {categoryIcon ? (
            <img 
              src={categoryIcon} 
              alt={`${category.name} icon`}
              className="w-full h-full object-contain drop-shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
            />
          ) : (
            <div className={`relative w-full h-full bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
              <IconComponent className="w-12 h-12 text-white drop-shadow-lg" />
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          <h3 className="font-black text-xl text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
            {category.name}
          </h3>
          <p className={`text-base font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
            {category.nameHindi}
          </p>
        </div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
      </div>
    </Card>
  );
};

export default CategoryCard;
