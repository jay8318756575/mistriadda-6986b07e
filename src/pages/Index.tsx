import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';
import MistriCard from '@/components/MistriCard';
import MistriProfileDialog from '@/components/MistriProfileDialog';
import CreateProfileDialog from '@/components/CreateProfileDialog';
import { categories } from '@/data/categories';
import { Mistri } from '@/types/mistri';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Users, MapPin, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'category'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all cities');
  const [selectedMistri, setSelectedMistri] = useState<Mistri | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentCategoryFilter, setCurrentCategoryFilter] = useState<string>('');
  const [allMistris, setAllMistris] = useState<Mistri[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch mistris from database on component mount
  useEffect(() => {
    fetchMistris();
  }, []);

  const fetchMistris = async () => {
    try {
      const { data, error } = await supabase
        .from('mistris')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching mistris:', error);
        toast({
          title: "त्रुटि",
          description: "मिस्त्री की जानकारी लोड करने में समस्या हुई",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        // Convert database response to Mistri type
        const mistris: Mistri[] = data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          location: item.location,
          mobile: item.mobile,
          experience: item.experience,
          rating: item.rating,
          description: item.description
        }));

        console.log('Fetched mistris from database:', mistris);
        setAllMistris(mistris);
      }
    } catch (error) {
      console.error('Error fetching mistris:', error);
      toast({
        title: "त्रुटि",
        description: "डेटा लोड करने में समस्या हुई",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileCreated = (newProfile: Mistri) => {
    console.log('Adding new profile to list:', newProfile);
    setAllMistris(prev => {
      const updatedList = [newProfile, ...prev]; // Add new profile at the beginning
      console.log('Updated mistris list:', updatedList);
      return updatedList;
    });
    // Automatically switch to search view to show the new profile
    setCurrentView('search');
  };

  const filteredMistris = useMemo(() => {
    return allMistris.filter(mistri => {
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
  }, [searchQuery, selectedCategory, selectedLocation, currentCategoryFilter, allMistris]);

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
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
            MistriAdda में आपका स्वागत है
          </h1>
          <div className="absolute -top-4 -right-4 animate-bounce">
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <p className="text-xl md:text-2xl text-gray-700 font-medium max-w-4xl mx-auto">
          🔧 सभी प्रकार के मिस्त्री एक ही जगह • 🔍 आसान खोज • ✅ विश्वसनीय सेवा
        </p>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{allMistris.length}+</div>
            <div className="text-sm">{t('mistri.count')}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <MapPin className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">75+</div>
            <div className="text-sm">{t('city.count')}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <Award className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">12+</div>
            <div className="text-sm">{t('category.count')}</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-xl shadow-lg">
            <Star className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">4.8★</div>
            <div className="text-sm">{t('rating')}</div>
          </div>
        </div>
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
        <h2 className="text-3xl font-bold text-center mb-8">
          <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            मिस्त्री की श्रेणियां
          </span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={handleCategoryClick}
              className="transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            />
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white p-12 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
        <h3 className="text-3xl font-bold mb-4">
          क्या आप मिस्त्री हैं?
        </h3>
        <p className="text-xl mb-8 opacity-90">
          अपनी प्रोफाइल बनाएं और अधिक काम पाएं • फोटो और वीडियो के साथ
        </p>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-white text-orange-600 hover:bg-gray-100 text-xl px-12 py-4 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          🚀 मिस्त्री के रूप में जुड़ें
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
      
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">डेटा लोड हो रहा है...</p>
        </div>
      ) : filteredMistris.length === 0 ? (
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
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">डेटा लोड हो रहा है...</p>
          </div>
        ) : filteredMistris.length === 0 ? (
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
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
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
        onProfileCreated={handleProfileCreated}
      />
    </div>
  );
};

export default Index;
