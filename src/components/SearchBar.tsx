
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Search, MapPin, MapPinned, Check, Sparkles, Target, Zap } from 'lucide-react';
import { categories } from '@/data/categories';
import { indiaStates, stateDistricts, majorCities } from '@/data/india-locations';

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
  const [selectedState, setSelectedState] = useState<string>("all");
  
  const availableLocations = useMemo(() => {
    if (selectedState === "all") {
      return Object.values(majorCities).flat();
    } else if (selectedState && majorCities[selectedState]) {
      return majorCities[selectedState];
    }
    return [];
  }, [selectedState]);

  return (
    <div className="relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 opacity-80"></div>
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-ping"></div>
      
      {/* Floating elements */}
      <div className="absolute top-4 right-8 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
      <div className="absolute bottom-6 left-12 w-1 h-1 bg-pink-400 rounded-full animate-pulse"></div>
      
      <div className="relative bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border-2 border-white/50 transition-all duration-500 hover:shadow-3xl hover:scale-[1.01]">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center">
            <Sparkles className="w-6 h-6 mr-2 text-purple-500 animate-pulse" />
            अपना परफेक्ट मिस्त्री खोजें
            <Sparkles className="w-6 h-6 ml-2 text-pink-500 animate-pulse" />
          </h3>
          <p className="text-gray-600 font-medium mt-2">बेहतरीन सेवा के लिए सबसे अच्छे मिस्त्री चुनें</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Search Input */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-purple-500 animate-pulse" />
              <Input
                placeholder="🔍 मिस्त्री का नाम खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-2 border-purple-300 focus:border-purple-500 bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 font-medium"
              />
            </div>
          </div>
          
          {/* Category Select */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative">
              <Target className="absolute left-4 top-4 w-5 h-5 text-blue-500 z-10 pointer-events-none" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="pl-12 py-4 text-lg border-2 border-blue-300 focus:border-blue-500 bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 font-medium">
                  <SelectValue placeholder="⚡ काम की श्रेणी चुनें" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-lg border-2 border-blue-200 shadow-2xl rounded-xl">
                  <SelectItem value="all" className="font-medium py-3">🌟 सभी श्रेणियां</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="font-medium py-3">
                      {category.name} ({category.nameHindi})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Location Select */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-green-300 focus:border-green-500 bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 flex justify-between pl-12 relative py-4 text-lg font-medium"
                  >
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-green-500" />
                    <span className="text-left flex-grow truncate">
                      {selectedLocation === "all cities" ? "🏙️ सभी शहर चुनें" : `📍 ${selectedLocation}`}
                    </span>
                    <MapPinned className="ml-2 h-5 w-5 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 bg-white/95 backdrop-blur-lg border-2 border-green-200 shadow-2xl rounded-xl" align="start">
                  <div className="grid grid-cols-1 gap-1">
                    <div className="p-3 border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                      <Select value={selectedState} onValueChange={setSelectedState}>
                        <SelectTrigger className="border-green-200 bg-white/80 rounded-xl font-medium">
                          <SelectValue placeholder="🗺️ राज्य चुनें" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 bg-white/95 backdrop-blur-sm">
                          <SelectItem value="all">🇮🇳 सभी राज्य</SelectItem>
                          {indiaStates.map((state) => (
                            <SelectItem key={state} value={state} className="font-medium">
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="max-h-56 overflow-y-auto p-1">
                      <div 
                        className="flex items-center px-4 py-3 cursor-pointer hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl transition-all duration-200 font-medium"
                        onClick={() => {
                          setSelectedLocation("all cities");
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="flex items-center">
                            <Sparkles className="w-4 h-4 mr-2 text-green-500" />
                            सभी शहर
                          </span>
                          {selectedLocation === "all cities" && <Check className="h-5 w-5 text-green-600" />}
                        </div>
                      </div>
                      {availableLocations.map((location) => (
                        <div 
                          key={location}
                          className="flex items-center px-4 py-3 cursor-pointer hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl transition-all duration-200 font-medium"
                          onClick={() => {
                            setSelectedLocation(location.toLowerCase());
                          }}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                              {location}
                            </span>
                            {selectedLocation === location.toLowerCase() && <Check className="h-5 w-5 text-green-600" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Search Button */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl blur opacity-60 group-hover:opacity-90 transition-opacity"></div>
            <Button 
              onClick={onSearch}
              className="relative w-full bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white font-black text-lg py-4 shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl"
            >
              <Zap className="w-5 h-5 mr-3 animate-pulse" />
              🚀 खोजें
            </Button>
          </div>
        </div>
        
        {/* Quick suggestions */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3 font-medium">🔥 पॉपुलर सर्च:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['प्लंबर', 'इलेक्ट्रिशियन', 'कारपेंटर', 'पेंटर'].map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-purple-700 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 border border-purple-200 hover:border-purple-300"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
