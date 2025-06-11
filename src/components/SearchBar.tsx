
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin } from 'lucide-react';
import { categories } from '@/data/categories';
import { upCities } from '@/data/up-locations';

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
  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
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
        
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-4 h-4 text-orange-500" />
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="pl-10 border-orange-300 focus:border-orange-500 bg-white shadow-sm">
              <SelectValue placeholder="शहर चुनें" />
            </SelectTrigger>
            <SelectContent className="bg-white max-h-48 overflow-y-auto">
              <SelectItem value="all cities">सभी शहर</SelectItem>
              {upCities.map((city) => (
                <SelectItem key={city} value={city.toLowerCase()}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
