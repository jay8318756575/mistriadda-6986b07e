
import { Button } from '@/components/ui/button';
import { UserPlus, Menu, Hammer, Wrench, Paintbrush, MapPin, Shield, Star, Sparkles } from 'lucide-react';

interface HeaderProps {
  onCreateProfile: () => void;
}

const Header = ({ onCreateProfile }: HeaderProps) => {
  return (
    <header className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-15 blur-3xl animate-ping"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 right-10 w-40 h-40 rounded-full bg-yellow-400 opacity-20 blur-2xl animate-bounce"></div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full opacity-60 animate-ping"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-yellow-300 rounded-full opacity-80 animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-70 animate-bounce"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-cyan-300 rounded-full opacity-60 animate-ping"></div>
      </div>
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              {/* Premium animated logo */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-white p-4 rounded-2xl shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <div className="flex items-center space-x-2">
                    <Hammer className="w-7 h-7 text-orange-600 animate-bounce" style={{ animationDuration: '2s', animationDelay: '0s' }} />
                    <Wrench className="w-7 h-7 text-blue-600 animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.2s' }} />
                    <Paintbrush className="w-7 h-7 text-green-600 animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <h1 className="text-5xl font-black bg-gradient-to-r from-yellow-300 via-pink-300 to-white bg-clip-text text-transparent">
                  MistriAdda
                </h1>
                <p className="text-lg text-cyan-200 font-semibold flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  भारत का प्रीमियम मिस्त्री प्लेटफॉर्म
                  <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
                </p>
              </div>
            </div>
            
            {/* Premium stats section */}
            <div className="hidden lg:flex items-center space-x-4 border-l-2 border-cyan-300/40 pl-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
                  <span className="text-cyan-100 text-xs font-medium">प्रमाणित मिस्त्री</span>
                  <span className="font-black text-xl text-yellow-300 flex items-center">
                    <Shield className="w-4 h-4 mr-1 animate-pulse" />15,000+
                  </span>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
                  <span className="text-purple-100 text-xs font-medium">खुश ग्राहक</span>
                  <span className="font-black text-xl text-yellow-300">2 लाख+</span>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
                  <span className="text-orange-100 text-xs font-medium">औसत रेटिंग</span>
                  <span className="font-black text-xl text-yellow-300 flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-yellow-300 animate-pulse" />4.9
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <Button
                variant="outline"
                onClick={onCreateProfile}
                className="relative border-2 border-white/50 text-white hover:text-purple-900 font-bold px-8 py-4 text-lg transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-white/30 group bg-white/10 backdrop-blur-sm hover:bg-white"
              >
                <UserPlus className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform animate-pulse" />
                <span className="relative">
                  🚀 मिस्त्री बनें
                  <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-1 bg-gradient-to-r from-pink-500 to-cyan-500 transition-all duration-500 rounded-full"></span>
                </span>
              </Button>
            </div>
            
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-white/20 p-3">
              <Menu className="w-7 h-7" />
            </Button>
          </div>
        </div>
        
        {/* Enhanced premium tagline */}
        <div className="hidden lg:block text-center mt-8">
          <p className="text-2xl font-bold bg-gradient-to-r from-cyan-200 via-pink-200 to-yellow-200 bg-clip-text text-transparent">
            ✨ "सपनों का घर बनाएं • विश्वसनीय मिस्त्री पाएं • देशभर में प्रीमियम सेवा" ✨
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
