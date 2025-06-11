
import { Button } from '@/components/ui/button';
import { UserPlus, Menu } from 'lucide-react';

interface HeaderProps {
  onCreateProfile: () => void;
}

const Header = ({ onCreateProfile }: HeaderProps) => {
  return (
    <header className="bg-orange-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">MistriAdda</h1>
            <p className="hidden md:block text-orange-100">मिस्त्री ढूंढें, काम करवाएं</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={onCreateProfile}
              className="border-white text-white hover:bg-white hover:text-orange-600"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              मिस्त्री बनें
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
