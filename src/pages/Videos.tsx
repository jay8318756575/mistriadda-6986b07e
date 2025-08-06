
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ShortsPlayer from '@/components/ShortsPlayer';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, ArrowLeft } from 'lucide-react';
import type { MistriVideo } from '@/components/VideoCard';
import { phpClient } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Videos = () => {
  const [videos, setVideos] = useState<MistriVideo[]>([]);
  const [mistris, setMistris] = useState<Record<string, { name: string; category: string }>>({});
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchVideos();
    
    // Listen for video upload events
    const handleVideoUploaded = () => {
      console.log('Video uploaded, refreshing videos list');
      fetchVideos();
    };
    
    window.addEventListener('videoUploaded', handleVideoUploaded);
    return () => window.removeEventListener('videoUploaded', handleVideoUploaded);
  }, []);

  const fetchVideos = async () => {
    try {
      console.log('Fetching videos from PHP API...');
      
      const videosResult = await phpClient.getVideos();

      if (!videosResult.success) {
        console.error('Error fetching videos:', videosResult.error);
        toast({
          title: "त्रुटि",
          description: "वीडियो लोड करने में समस्या हुई",
          variant: "destructive"
        });
        return;
      }

      console.log('Videos fetched:', videosResult.data);
      setVideos(videosResult.data || []);

      // Fetch mistri information
      if (videosResult.data && videosResult.data.length > 0) {
        const mistriIds = [...new Set(videosResult.data.map(v => v.mistri_id))];
        
        const mistrisResult = await phpClient.getMistris();

        if (mistrisResult.success && mistrisResult.data) {
          const filteredMistris = mistrisResult.data.filter(mistri => mistriIds.includes(mistri.id));
          const mistrisMap = filteredMistris.reduce((acc, mistri) => {
            acc[mistri.id] = { name: mistri.name, category: mistri.category };
            return acc;
          }, {} as Record<string, { name: string; category: string }>);
          
          setMistris(mistrisMap);
        }
      }

    } catch (error) {
      console.error('Error in fetchVideos:', error);
      toast({
        title: "त्रुटि",
        description: "डेटा लोड करने में समस्या हुई",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      handlePrevious();
    } else if (event.key === 'ArrowDown') {
      handleNext();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentVideoIndex, videos.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>वीडियो लोड हो रहे हैं...</p>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/">
              <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                वापस जाएं
              </Button>
            </Link>
          </div>
          <div className="text-center py-20 text-white">
            <h2 className="text-2xl font-bold mb-4">कोई वीडियो नहीं मिला</h2>
            <p className="text-orange-100">अभी तक कोई वीडियो अपलोड नहीं किया गया है</p>
          </div>
        </div>
      </div>
    );
  }

  const currentVideo = videos[currentVideoIndex];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Header - Only show on mobile or when needed */}
      <div className="absolute top-4 left-4 z-50">
        <Link to="/">
          <Button variant="ghost" className="text-white hover:bg-white hover:bg-opacity-20">
            <ArrowLeft className="w-5 h-5 mr-2" />
            वापस
          </Button>
        </Link>
      </div>

      {/* Video counter */}
      <div className="absolute top-4 right-4 z-50 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
        {currentVideoIndex + 1} / {videos.length}
      </div>

      {/* Main video display */}
      <div className="flex items-center justify-center min-h-screen">
        <ShortsPlayer
          video={currentVideo}
          mistriName={mistris[currentVideo.mistri_id]?.name}
          mistriCategory={mistris[currentVideo.mistri_id]?.category}
          isActive={true}
        />
      </div>

      {/* Navigation controls */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
        <Button
          onClick={handlePrevious}
          disabled={currentVideoIndex === 0}
          className="bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 disabled:opacity-30"
        >
          <ChevronUp className="w-6 h-6 text-white" />
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={currentVideoIndex === videos.length - 1}
          className="bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 disabled:opacity-30"
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </Button>
      </div>

      {/* Instruction text */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center text-sm opacity-70">
        <p>↑↓ तीर कुंजी या बटन दबाकर वीडियो बदलें</p>
      </div>
    </div>
  );
};

export default Videos;
