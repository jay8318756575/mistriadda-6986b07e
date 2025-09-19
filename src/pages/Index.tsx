import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';
import MistriCard from '@/components/MistriCard';
import MistriProfileDialog from '@/components/MistriProfileDialog';
import CreateProfileDialog from '@/components/CreateProfileDialog';
import VideoUpload from '@/components/VideoUpload';
import { categories } from '@/data/categories';
import { Mistri } from '@/types/mistri';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Star, Users, MapPin, Award, Video, Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { phpClient } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ErrorHandler } from '@/utils/errorHandler';
import { Link } from 'react-router-dom';

const Index = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'category'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all cities');
  const [selectedMistri, setSelectedMistri] = useState<Mistri | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [currentCategoryFilter, setCurrentCategoryFilter] = useState<string>('');
  const [allMistris, setAllMistris] = useState<Mistri[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [phpBackendStatus, setPHPBackendStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  // Check PHP backend status and fetch mistris on component mount
  useEffect(() => {
    checkBackendAndFetchData();
  }, []);

  const checkBackendAndFetchData = async () => {
    // Check PHP backend status first
    const status = await phpClient.checkPHPStatus();
    setPHPBackendStatus(status.success ? 'available' : 'unavailable');
    
    // Then fetch mistris
    fetchMistris();
  };

  const fetchMistris = async () => {
    console.log('=== STARTING FETCH FROM PHP API ===');
    
    try {
      console.log('Fetching all mistris from PHP API...');
      const result = await phpClient.getMistris();

      console.log('PHP API query result:', result);

      if (!result.success) {
        console.error('Error fetching mistris:', result.error);
        console.log('Using fallback sample data due to API error');
        
        // Use sample data as fallback
        const { sampleMistris } = await import('@/data/sample-mistris');
        setAllMistris(sampleMistris);
        setIsLoading(false);
        
        toast({
          title: "डेटा लोड करने में समस्या",
          description: result.error || 'मिस्त्री की जानकारी लोड नहीं हो सकी',
          variant: "destructive"
        });
        return;
      }

      if (result.data) {
        console.log('Raw API data:', result.data);
        console.log('Number of records fetched:', result.data.length);

        // Convert API response to Mistri type
        const mistris: Mistri[] = result.data.map((item: any) => {
          console.log('Converting API item:', item);
          return {
            id: item.id,
            name: item.name,
            category: item.category,
            location: item.location,
            mobile: item.mobile,
            experience: item.experience,
            rating: item.rating,
            description: item.description,
            aadhar_number: item.aadhar_number || undefined,
            aadhar_address: item.aadhar_address || undefined,
            verification_status: item.verification_status as 'pending' | 'verified' | 'rejected' | undefined,
            admin_approval_status: item.admin_approval_status as 'pending' | 'approved' | 'rejected' | undefined,
            phone_verified: item.phone_verified || undefined,
            id_proof_url: item.id_proof_url || undefined,
            profile_photo_url: item.profile_photo_url || undefined,
            work_gallery: item.work_gallery || undefined,
            is_active: item.is_active || undefined,
            last_active: item.last_active || undefined,
            latitude: item.latitude || undefined,
            longitude: item.longitude || undefined,
            created_at: item.created_at || undefined,
            updated_at: item.updated_at || undefined
          };
        });

        console.log('Converted mistris array:', mistris);
        console.log('Setting mistris in state...');
        setAllMistris(mistris);
        console.log('Mistris set in state successfully');
      } else {
        console.log('No data returned from API (data is null/undefined)');
      }
    } catch (fetchError) {
      console.error('Fetch mistris failed completely:', fetchError);
      
      // Use sample data as fallback
      console.log('Loading sample data as fallback...');
      const { sampleMistris } = await import('@/data/sample-mistris');
      setAllMistris(sampleMistris);
      
      // Show user-friendly message
      toast({
        title: "डेमो मोड",
        description: "आप डेमो डेटा देख रहे हैं। सभी फ़ीचर उपलब्ध हैं।",
        variant: "default"
      });
    } finally {
      console.log('=== FETCH COMPLETED ===');
      setIsLoading(false);
    }
  };

  const handleProfileCreated = (newProfile: Mistri) => {
    console.log('=== PROFILE CREATED CALLBACK ===');
    console.log('New profile received:', newProfile);
    console.log('Current mistris in state before update:', allMistris);
    
    setAllMistris(prev => {
      const updatedList = [newProfile, ...prev]; // Add new profile at the beginning
      console.log('Updated mistris list:', updatedList);
      return updatedList;
    });
    
    // Automatically switch to search view to show the new profile
    setCurrentView('search');
    console.log('Switched to search view');
    
    // Refetch data to ensure consistency
    setTimeout(() => {
      fetchMistris();
    }, 1000);
  };

  // Enhanced address similarity calculation
  const calculateAddressSimilarity = (address1: string, address2: string): number => {
    if (!address1 || !address2) return 0;
    
    const normalize = (addr: string) => addr.toLowerCase().replace(/[^\w\s]/g, '').trim();
    const words1 = normalize(address1).split(/\s+/).filter(w => w.length > 2);
    const words2 = normalize(address2).split(/\s+/).filter(w => w.length > 2);
    
    if (words1.length === 0 || words2.length === 0) return 0;
    
    let score = 0;
    const maxWords = Math.max(words1.length, words2.length);
    
    // Check for exact matches (higher weight)
    words1.forEach(word1 => {
      words2.forEach(word2 => {
        if (word1 === word2) {
          score += 2;
        } else if (word1.includes(word2) || word2.includes(word1)) {
          score += 1;
        } else if (word1.substring(0, 3) === word2.substring(0, 3)) {
          score += 0.5;
        }
      });
    });
    
    return Math.min(score / (maxWords * 2), 1);
  };

  // Get user's location-based reference address
  const getUserLocationReference = (): string => {
    // Priority: 1. User's current location (if available), 2. Search location, 3. Default
    if (selectedLocation && selectedLocation !== 'all cities') {
      return selectedLocation;
    }
    return 'Uttar Pradesh India'; // Default reference for UP-based service
  };

  const filteredMistris = useMemo(() => {
    let filtered = allMistris.filter(mistri => {
      const matchesSearch = searchQuery === '' || 
        mistri.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mistri.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Fix category filtering logic - prioritize currentCategoryFilter
      const matchesCategory = 
        (currentCategoryFilter !== '' && mistri.category === currentCategoryFilter) ||
        (currentCategoryFilter === '' && (selectedCategory === 'all' || mistri.category === selectedCategory));
      
      const matchesLocation = selectedLocation === 'all cities' || 
        mistri.location.toLowerCase().includes(selectedLocation.toLowerCase());
      
      return matchesSearch && matchesCategory && matchesLocation;
    });

    // Apply proximity-based sorting for all views when we have a specific location
    if ((currentView === 'category' || currentView === 'search') && 
        (selectedLocation !== 'all cities' || currentCategoryFilter !== '')) {
      
      const referenceAddress = getUserLocationReference();
      
      filtered = filtered.sort((a, b) => {
        // Calculate proximity scores using Aadhar address first, then location
        const addressA = a.aadhar_address || a.location;
        const addressB = b.aadhar_address || b.location;
        
        const similarityA = calculateAddressSimilarity(addressA, referenceAddress);
        const similarityB = calculateAddressSimilarity(addressB, referenceAddress);
        
        // Secondary sort by rating if proximity is similar
        if (Math.abs(similarityA - similarityB) < 0.1) {
          return (b.rating || 0) - (a.rating || 0);
        }
        
        return similarityB - similarityA; // Sort by highest similarity first
      });
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedLocation, currentCategoryFilter, allMistris, currentView]);

  const handleCategoryClick = (categoryId: string) => {
    setCurrentCategoryFilter(categoryId);
    setCurrentView('category');
    
    // Show toast about location-based suggestions
    toast({
      title: "स्थानीय मिस्त्री सुझाव",
      description: "आधार कार्ड के पते के आधार पर नजदीकी मिस्त्री दिखाए जा रहे हैं",
    });
  };

  const handleSearch = () => {
    setCurrentView('search');
    
    // Show toast about location-based suggestions if location is selected
    if (selectedLocation !== 'all cities') {
      toast({
        title: "स्थानीय मिस्त्री सुझाव",
        description: `${selectedLocation} के नजदीकी मिस्त्री दिखाए जा रहे हैं`,
      });
    }
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
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🔧 MistriAdda में आपका स्वागत है
          </h1>
          <div className="absolute -top-4 -right-4 animate-bounce">
            <Star className="w-8 h-8 text-yellow-300" />
          </div>
        </div>
        <p className="text-xl md:text-2xl text-white/90 font-medium max-w-4xl mx-auto drop-shadow">
          सभी प्रकार के मिस्त्री एक ही जगह • आसान खोज • विश्वसनीय सेवा
        </p>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-8">
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 text-white p-6 rounded-xl shadow-lg hover:bg-white/30 transition-all">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{allMistris.length}+</div>
            <div className="text-sm">मिस्त्री</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 text-white p-6 rounded-xl shadow-lg hover:bg-white/30 transition-all">
            <MapPin className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">75+</div>
            <div className="text-sm">शहर</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 text-white p-6 rounded-xl shadow-lg hover:bg-white/30 transition-all">
            <Award className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">14+</div>
            <div className="text-sm">श्रेणी</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 text-white p-6 rounded-xl shadow-lg hover:bg-white/30 transition-all">
            <Star className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">4.8★</div>
            <div className="text-sm">रेटिंग</div>
          </div>
        </div>
      </div>

      {/* Backend Status Indicator */}
      {phpBackendStatus !== 'checking' && (
        <Card className={`border-2 ${phpBackendStatus === 'available' ? 'border-green-400 bg-green-50' : 'border-blue-400 bg-blue-50'} shadow-lg`}>
          <CardContent className="py-3">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${phpBackendStatus === 'available' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
               <span className={`text-sm font-medium ${phpBackendStatus === 'available' ? 'text-green-800' : 'text-blue-800'}`}>
                 {phpBackendStatus === 'available' 
                   ? '✅ Live डेटा - सभी फ़ीचर उपलब्ध हैं' 
                   : '🎯 डेमो मोड - सैंपल डेटा के साथ सभी फ़ीचर देखें'}
               </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Upload Section - New Addition */}
      <Card className="border-2 border-gradient-to-r from-purple-400 to-pink-400 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Video logo with colorful design like the reference image */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg transform rotate-12">
                  <Video className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-pink-400 to-red-500 rounded-full animate-pulse"></div>
              </div>
              <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                शॉर्ट वीडियो सेक्शन
              </CardTitle>
            </div>
          </div>
          <CardDescription className="text-gray-700 font-medium">
            अपने किसी भी काम की वीडियो अपलोड करें
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => setShowVideoUpload(!showVideoUpload)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex-1 shadow-lg"
            >
              <Upload className="w-4 h-4 mr-2" />
              {showVideoUpload ? 'अपलोड छुपाएं' : 'नया वीडियो अपलोड करें'}
            </Button>
            <Link to="/video-feed" className="flex-1">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              >
                <Video className="w-4 h-4 mr-2" />
                स्क्रॉल वीडियो फीड
              </Button>
            </Link>
            <Link to="/videos" className="flex-1">
              <Button 
                variant="outline" 
                className="w-full border-2 border-purple-400 text-purple-600 hover:bg-purple-50 hover:border-purple-500"
              >
                <Video className="w-4 h-4 mr-2" />
                सभी वीडियो देखें
              </Button>
            </Link>
          </div>
          
          {showVideoUpload && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">📌 सूचना:</p>
                <p className="text-sm text-blue-700 mt-1">
                  PHP backend उपलब्ध नहीं होने के कारण वीडियो अपलोड फ़ीचर अस्थायी रूप से निष्क्रिय है।
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  आप अभी भी सैंपल डेटा देख सकते हैं और अन्य फ़ीचर का उपयोग कर सकते हैं।
                </p>
              </div>
              <VideoUpload 
                mistriId="f005a55f-be93-41b1-b183-e9ae639d27c8" 
                onVideoUploaded={() => setShowVideoUpload(false)}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
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
          {filteredMistris.map((mistri) => {
            // Calculate proximity score for display
            const referenceAddress = getUserLocationReference();
            const mistriAddress = mistri.aadhar_address || mistri.location;
            const proximityScore = calculateAddressSimilarity(mistriAddress, referenceAddress);
            
            return (
              <MistriCard
                key={mistri.id}
                mistri={mistri}
                onViewDetails={setSelectedMistri}
                proximityScore={proximityScore}
              />
            );
          })}
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
            {filteredMistris.map((mistri) => {
              // Calculate proximity score for display
              const referenceAddress = getUserLocationReference();
              const mistriAddress = mistri.aadhar_address || mistri.location;
              const proximityScore = calculateAddressSimilarity(mistriAddress, referenceAddress);
              
              return (
                <MistriCard
                  key={mistri.id}
                  mistri={mistri}
                  onViewDetails={setSelectedMistri}
                  proximityScore={proximityScore}
                />
              );
            })}
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
