
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
import { Search, MapPin, MapPinned, Check } from 'lucide-react';
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
    <div className="bg-white p-6 rounded-xl shadow-xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 transition-all duration-300 hover:shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-orange-500" />
          <Input
            placeholder="मिस्त्री का नाम खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-orange-300 focus:border-orange-500 bg-white shadow-sm"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="border-orange-300 focus:border-orange-500 bg-white shadow-sm">
            <SelectValue placeholder="काम की श्रेणी चुनें" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">सभी श्रेणियां</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name} ({category.nameHindi})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="space-y-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full border-orange-300 focus:border-orange-500 bg-white shadow-sm flex justify-between pl-10 relative"
              >
                <MapPin className="absolute left-3 top-2 w-4 h-4 text-orange-500" />
                <span className="text-left flex-grow truncate">
                  {selectedLocation === "all cities" ? "सभी शहर चुनें" : selectedLocation}
                </span>
                <MapPinned className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="grid grid-cols-1 gap-1">
                <div className="p-2 border-b">
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder="राज्य चुनें" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="all">सभी राज्य</SelectItem>
                      {indiaStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="max-h-56 overflow-y-auto p-1">
                  <div 
                    className="flex items-center px-3 py-2 cursor-pointer hover:bg-orange-50 rounded-md"
                    onClick={() => {
                      setSelectedLocation("all cities");
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>सभी शहर</span>
                      {selectedLocation === "all cities" && <Check className="h-4 w-4 text-orange-600" />}
                    </div>
                  </div>
                  {availableLocations.map((location) => (
                    <div 
                      key={location}
                      className="flex items-center px-3 py-2 cursor-pointer hover:bg-orange-50 rounded-md"
                      onClick={() => {
                        setSelectedLocation(location.toLowerCase());
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{location}</span>
                        {selectedLocation === location.toLowerCase() && <Check className="h-4 w-4 text-orange-600" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <Button 
          onClick={onSearch}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Search className="w-4 h-4 mr-2" />
          खोजें
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
