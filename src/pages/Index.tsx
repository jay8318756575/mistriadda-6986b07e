
import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';
import MistriCard from '@/components/MistriCard';
import MistriProfileDialog from '@/components/MistriProfileDialog';
import CreateProfileDialog from '@/components/CreateProfileDialog';
import { categories } from '@/data/categories';
import { sampleMistris } from '@/data/sample-mistris';
import { Mistri } from '@/types/mistri';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'category'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all cities');
  const [selectedMistri, setSelectedMistri] = useState<Mistri | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentCategoryFilter, setCurrentCategoryFilter] = useState<string>('');

  const filteredMistris = useMemo(() => {
    return sampleMistris.filter(mistri => {
      const matchesSearch = searchQuery === '' || 
        mistri.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mistri.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        mistri.category === selectedCategory ||
        currentCategoryFilter === '' ||
        mistri.category === currentCategoryFilter;
      
      const matchesLocation = selectedLocation === 'all cities' || 
        mistri.location.toLowerCase().includes(selectedLocation.toLowerCase());
      
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [searchQuery, selectedCategory, selectedLocation, currentCategoryFilter]);

  const handleCategoryClick = (categoryId: string) => {
    setCurrentCategoryFilter(categoryId);
    setCurrentView('category');
  };

  const handleSearch = () => {
    setCurrentView('search');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentCategoryFilter('');
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLocation('all cities');
  };

  const renderHomeView = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">
          MistriAdda में आपका स्वागत है
        </h1>
        <p className="text-lg text-gray-600">
          सभी प्रकार के मिस्त्री एक ही जगह • आसान खोज • विश्वसनीय सेवा
        </p>
      </div>
      
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        onSearch={handleSearch}
      />
      
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          मिस्त्री की श्रेणियां
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={handleCategoryClick}
            />
          ))}
        </div>
      </div>
      
      <div className="text-center bg-orange-50 p-8 rounded-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          क्या आप मिस्त्री हैं?
        </h3>
        <p className="text-gray-600 mb-6">
          अपनी प्रोफाइल बनाएं और अधिक काम पाएं
        </p>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-3"
        >
          मिस्त्री के रूप में जुड़ें
        </Button>
      </div>
    </div>
  );

  const renderSearchResults = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={handleBackToHome}
          className="border-orange-300 text-orange-600 hover:bg-orange-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          वापस जाएं
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">
          खोज परिणाम ({filteredMistris.length})
        </h2>
      </div>
      
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        onSearch={handleSearch}
      />
      
      {filteredMistris.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">कोई मिस्त्री नहीं मिला</p>
          <p className="text-gray-400">कृपया अपनी खोज बदलकर दोबारा कोशिश करें</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMistris.map((mistri) => (
            <MistriCard
              key={mistri.id}
              mistri={mistri}
              onViewDetails={setSelectedMistri}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderCategoryView = () => {
    const category = categories.find(c => c.id === currentCategoryFilter);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={handleBackToHome}
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            वापस जाएं
          </Button>
          <h2 className="text-2xl font-bold text-gray-800">
            {category?.name} ({category?.nameHindi}) - {filteredMistris.length} मिस्त्री
          </h2>
        </div>
        
        {filteredMistris.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">इस श्रेणी में कोई मिस्त्री नहीं मिला</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredMistris.map((mistri) => (
              <MistriCard
                key={mistri.id}
                mistri={mistri}
                onViewDetails={setSelectedMistri}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <Header onCreateProfile={() => setShowCreateDialog(true)} />
      
      <main className="container mx-auto px-4 py-8">
        {currentView === 'home' && renderHomeView()}
        {currentView === 'search' && renderSearchResults()}
        {currentView === 'category' && renderCategoryView()}
      </main>
      
      <MistriProfileDialog
        mistri={selectedMistri}
        isOpen={!!selectedMistri}
        onClose={() => setSelectedMistri(null)}
      />
      
      <CreateProfileDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </div>
  );
};

export default Index;
