
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, MapPin, Sparkles, Target, Zap, Globe } from 'lucide-react';
import { categories } from '@/data/categories';
import { indiaStates, majorCities } from '@/data/india-locations';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  onSearch: () => void;
}

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  onSearch
}: SearchBarProps) => {
  const { t } = useLanguage();
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all cities");
  
  const availableCities = useMemo(() => {
    if (selectedState === "all") {
      return Object.values(majorCities).flat();
    } else if (selectedState && majorCities[selectedState]) {
      return majorCities[selectedState];
    }
    return [];
  }, [selectedState]);

  // Update the combined location when state or city changes
  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity("all cities");
    if (state === "all") {
      setSelectedLocation("all cities");
    } else {
      setSelectedLocation(state.toLowerCase());
    }
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    if (city === "all cities") {
      setSelectedLocation(selectedState === "all" ? "all cities" : selectedState.toLowerCase());
    } else {
      setSelectedLocation(city.toLowerCase());
    }
  };

  const popularSearchTerms = [
    { hi: 'प्लंबर', en: 'Plumber' },
    { hi: 'इलेक्ट्रिशियन', en: 'Electrician' },
    { hi: 'कारपेंटर', en: 'Carpenter' },
    { hi: 'पेंटर', en: 'Painter' }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-orange-300 to-red-200 opacity-90"></div>
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-orange-500/40 to-red-500/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-r from-red-500/40 to-orange-500/40 rounded-full blur-3xl animate-ping"></div>
      
      {/* Floating elements */}
      <div className="absolute top-4 right-8 w-2 h-2 bg-orange-600 rounded-full animate-bounce"></div>
      <div className="absolute bottom-6 left-12 w-1 h-1 bg-red-600 rounded-full animate-pulse"></div>
      
      <div className="relative bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border-2 border-orange-200/50 transition-all duration-500 hover:shadow-3xl hover:scale-[1.01]">
        {/* Language Selector */}
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-black bg-gradient-to-r from-orange-700 via-red-600 to-orange-800 bg-clip-text text-transparent flex items-center justify-center">
            <Sparkles className="w-6 h-6 mr-2 text-orange-600 animate-pulse" />
            {t('search.header')}
            <Sparkles className="w-6 h-6 ml-2 text-red-600 animate-pulse" />
          </h3>
          <p className="text-gray-700 font-medium mt-2">{t('search.subtitle')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Search Input */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-orange-600 animate-pulse" />
              <Input
                placeholder={`🔍 ${t('search.placeholder')}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-2 border-orange-300 focus:border-orange-500 bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 font-medium"
              />
            </div>
          </div>
          
          {/* Category Select */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative">
              <Target className="absolute left-4 top-4 w-5 h-5 text-red-600 z-10 pointer-events-none" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="pl-12 py-4 text-lg border-2 border-red-300 focus:border-red-500 bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 font-medium">
                  <SelectValue placeholder={`⚡ ${t('search.category')}`} />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-lg border-2 border-red-200 shadow-2xl rounded-xl z-50">
                  <SelectItem value="all" className="font-medium py-3">🌟 {t('search.allCategories')}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="font-medium py-3">
                      {category.name} ({category.nameHindi})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* State Select */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative">
              <Globe className="absolute left-4 top-4 w-5 h-5 text-purple-600 z-10 pointer-events-none" />
              <Select value={selectedState} onValueChange={handleStateChange}>
                <SelectTrigger className="pl-12 py-4 text-lg border-2 border-purple-300 focus:border-purple-500 bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 font-medium">
                  <SelectValue placeholder={`🗺️ ${t('search.state')}`} />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-lg border-2 border-purple-200 shadow-2xl rounded-xl z-50 max-h-60">
                  <SelectItem value="all" className="font-medium py-3">🇮🇳 {t('search.allStates')}</SelectItem>
                  {indiaStates.map((state) => (
                    <SelectItem key={state} value={state} className="font-medium py-3">
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* City Select */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 w-5 h-5 text-orange-600 z-10 pointer-events-none" />
              <Select value={selectedCity} onValueChange={handleCityChange}>
                <SelectTrigger className="pl-12 py-4 text-lg border-2 border-orange-400 focus:border-orange-600 bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 font-medium">
                  <SelectValue placeholder={`🏙️ ${t('search.city')}`} />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-lg border-2 border-orange-200 shadow-2xl rounded-xl z-50 max-h-60">
                  <SelectItem value="all cities" className="font-medium py-3">🌟 {t('search.allCities')}</SelectItem>
                   {availableCities.map((city, index) => (
                     <SelectItem key={`${city}-${index}`} value={city} className="font-medium py-3">
                       📍 {city}
                     </SelectItem>
                   ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Search Button */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-red-700 rounded-2xl blur opacity-60 group-hover:opacity-90 transition-opacity"></div>
            <Button 
              onClick={onSearch}
              className="relative w-full bg-gradient-to-r from-red-600 via-orange-600 to-red-700 hover:from-red-700 hover:via-orange-700 hover:to-red-800 text-white font-black text-lg py-4 shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl"
            >
              <Zap className="w-5 h-5 mr-3 animate-pulse" />
              🚀 {t('search.button')}
            </Button>
          </div>
        </div>
        
        {/* Quick suggestions */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700 mb-3 font-medium">🔥 {t('search.popular')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularSearchTerms.map((term, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(term.hi)}
                className="px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 hover:from-orange-200 hover:to-red-200 text-orange-800 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 border border-orange-300 hover:border-orange-400"
              >
                {term.hi} / {term.en}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
