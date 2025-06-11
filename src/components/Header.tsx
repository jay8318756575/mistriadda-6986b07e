
import { Button } from '@/components/ui/button';
import { UserPlus, Menu, Hammer, Wrench, Paintbrush } from 'lucide-react';

interface HeaderProps {
  onCreateProfile: () => void;
}

const Header = ({ onCreateProfile }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white shadow-2xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {/* Colorful logo with worker icons */}
              <div className="bg-white p-2 rounded-full shadow-lg">
                <div className="flex items-center space-x-1">
                  <Hammer className="w-6 h-6 text-orange-600" />
                  <Wrench className="w-6 h-6 text-blue-600" />
                  <Paintbrush className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
                  MistriAdda
                </h1>
                <p className="text-sm text-orange-100 font-medium">उत्तर प्रदेश का सबसे बड़ा मिस्त्री प्लेटफॉर्म</p>
              </div>
            </div>
            <p className="hidden md:block text-orange-100 text-lg font-medium">
              मिस्त्री ढूंढें, काम करवाएं • हर घर की जरूरत
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={onCreateProfile}
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-semibold px-6 py-3 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              मिस्त्री बनें
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-white/20">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
