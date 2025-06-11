
import { Category } from '@/types/mistri';
import { Card } from '@/components/ui/card';
import { 
  Zap, Wrench, Paintbrush, Hammer, Settings, 
  Flame, Leaf, Sparkles, Car, Shield, ChefHat 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
  Zap, Wrench, Paintbrush, Hammer, Settings,
  Flame, Leaf, Sparkles, Car, Shield, ChefHat,
  Brick: Hammer // Fallback for brick
};

interface CategoryCardProps {
  category: Category;
  onClick: (categoryId: string) => void;
  className?: string;
}

const CategoryCard = ({ category, onClick, className }: CategoryCardProps) => {
  const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Settings;

  return (
    <Card 
      className={cn(
        "p-6 text-center cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white border-orange-200 hover:border-orange-300",
        className
      )}
      onClick={() => onClick(category.id)}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="p-3 bg-orange-100 rounded-full">
          <IconComponent className="w-8 h-8 text-orange-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{category.name}</h3>
          <p className="text-sm text-gray-600">{category.nameHindi}</p>
        </div>
      </div>
    </Card>
  );
};

export default CategoryCard;
