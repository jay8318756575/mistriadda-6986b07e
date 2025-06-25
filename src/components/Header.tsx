
import { useState } from 'react';
import { Button } from './ui/button';
import { Menu, X, Plus, Video } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onCreateProfile?: () => void;
}

const Header = ({ onCreateProfile }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg p-2">
              <span className="text-xl font-bold">🔧</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              MistriAdda
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-gray-700 hover:text-orange-600 font-medium transition-colors ${
                isActive('/') ? 'text-orange-600' : ''
              }`}
            >
              होम
            </Link>
            <Link 
              to="/videos" 
              className={`flex items-center space-x-1 text-gray-700 hover:text-orange-600 font-medium transition-colors ${
                isActive('/videos') ? 'text-orange-600' : ''
              }`}
            >
              <Video className="w-4 h-4" />
              <span>वीडियो</span>
            </Link>
            <LanguageSelector />
            {onCreateProfile && (
              <Button 
                onClick={onCreateProfile}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                मिस्त्री बनें
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t">
            <nav className="px-4 py-4 space-y-4">
              <Link 
                to="/" 
                className={`block text-gray-700 hover:text-orange-600 font-medium transition-colors ${
                  isActive('/') ? 'text-orange-600' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                होम
              </Link>
              <Link 
                to="/videos" 
                className={`flex items-center space-x-1 text-gray-700 hover:text-orange-600 font-medium transition-colors ${
                  isActive('/videos') ? 'text-orange-600' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Video className="w-4 h-4" />
                <span>वीडियो</span>
              </Link>
              <div className="pt-2">
                <LanguageSelector />
              </div>
              {onCreateProfile && (
                <Button 
                  onClick={() => {
                    onCreateProfile();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  मिस्त्री बनें
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
