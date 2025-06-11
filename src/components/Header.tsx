
import { Button } from '@/components/ui/button';
import { UserPlus, Menu, Hammer, Wrench, Paintbrush, MapPin, Shield, Star } from 'lucide-react';

interface HeaderProps {
  onCreateProfile: () => void;
}

const Header = ({ onCreateProfile }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white shadow-2xl relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -left-8 -top-8 w-24 h-24 rounded-full bg-yellow-400 opacity-30 blur-xl"></div>
      <div className="absolute right-1/4 -bottom-12 w-32 h-32 rounded-full bg-pink-400 opacity-20 blur-xl"></div>
      <div className="absolute left-1/3 -top-16 w-40 h-40 rounded-full bg-orange-300 opacity-20 blur-xl"></div>
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* Animated logo */}
              <div className="bg-white p-2 rounded-full shadow-lg group hover:shadow-orange-300/50 transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-1">
                  <Hammer className="w-6 h-6 text-orange-600 animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.1s' }} />
                  <Wrench className="w-6 h-6 text-blue-600 animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
                  <Paintbrush className="w-6 h-6 text-green-600 animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
                  MistriAdda
                </h1>
                <p className="text-sm text-orange-100 font-medium flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />भारत का सबसे बड़ा मिस्त्री प्लेटफॉर्म
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 border-l-2 border-orange-300/30 pl-4">
              <div className="flex flex-col items-center bg-white/10 rounded-lg px-3 py-1">
                <span className="text-orange-100 text-xs">प्रमाणित मिस्त्री</span>
                <span className="font-bold text-yellow-300 flex items-center">
                  <Shield className="w-3 h-3 mr-1" />10,000+
                </span>
              </div>
              <div className="flex flex-col items-center bg-white/10 rounded-lg px-3 py-1">
                <span className="text-orange-100 text-xs">उपयोगकर्ताओं की संख्या</span>
                <span className="font-bold text-yellow-300">1 लाख+</span>
              </div>
              <div className="flex flex-col items-center bg-white/10 rounded-lg px-3 py-1">
                <span className="text-orange-100 text-xs">औसत रेटिंग</span>
                <span className="font-bold text-yellow-300 flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-yellow-300" />4.8
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={onCreateProfile}
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-semibold px-6 py-3 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-white/30 group"
            >
              <UserPlus className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              <span className="relative">
                मिस्त्री बनें
                <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-orange-600 transition-all duration-300"></span>
              </span>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-white/20">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
        
        {/* Enhanced tagline */}
        <p className="hidden lg:block text-center text-orange-100 text-xl font-medium mt-4 italic">
          "मिस्त्री ढूंढें, काम करवाएं • हर घर की जरूरत • देशभर में सेवा उपलब्ध"
        </p>
      </div>
    </header>
  );
};

export default Header;
