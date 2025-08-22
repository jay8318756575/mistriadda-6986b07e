import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Heart, MessageCircle, Share2, Volume2, VolumeX, ArrowUp, ArrowDown } from 'lucide-react';
import { phpClient } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { hi } from 'date-fns/locale';
import type { MistriVideo } from './VideoCard';

interface ScrollableVideoFeedProps {
  className?: string;
}

const ScrollableVideoFeed = ({ className = "" }: ScrollableVideoFeedProps) => {
  const [videos, setVideos] = useState<MistriVideo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchVideos();
    
    // Listen for video upload events to refresh the feed
    const handleVideoUploaded = () => {
      fetchVideos();
    };
    
    window.addEventListener('videoUploaded', handleVideoUploaded);
    return () => window.removeEventListener('videoUploaded', handleVideoUploaded);
  }, []);

  useEffect(() => {
    // Auto-play current video when index changes
    if (videoRef.current && videos.length > 0) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        const playPromise = videoRef.current.play();
        if (playPromise && typeof (playPromise as Promise<void>).catch === 'function') {
          (playPromise as Promise<void>).catch((err) => {
            console.error('Autoplay prevented or error:', err);
            setIsPlaying(false);
            toast({
              title: 'ऑटोप्ले रुका',
              description: 'वीडियो चलाने के लिए प्ले बटन दबाएं',
              variant: 'default'
            });
          });
        }
      }
    }
  }, [currentIndex, videos, isPlaying, toast]);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const result = await phpClient.getVideos();
      
      if (result.success && result.data) {
        setVideos(result.data);
      } else {
        console.error('Error fetching videos:', result.error);
      }
    } catch (error) {
      console.error('Error in fetchVideos:', error);
      toast({
        title: "त्रुटि",
        description: "वीडियो लोड करने में समस्या हुई",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, videos, isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const toggleLike = () => {
    if (videos[currentIndex]) {
      const videoId = videos[currentIndex].id;
      const newLikedVideos = new Set(likedVideos);
      
      if (likedVideos.has(videoId)) {
        newLikedVideos.delete(videoId);
      } else {
        newLikedVideos.add(videoId);
      }
      
      setLikedVideos(newLikedVideos);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: hi 
      });
    } catch {
      return 'कुछ समय पहले';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">वीडियो लोड हो रहे हैं...</p>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg font-medium">कोई वीडियो नहीं मिला</p>
          <p className="text-gray-400 text-sm mt-2">
            पहली वीडियो अपलोड करें और अपना काम दिखाएं!
          </p>
        </div>
      </div>
    );
  }

  const currentVideo = videos[currentIndex];

  return (
    <div ref={containerRef} className={`relative bg-black ${className}`}>
      {/* Video Container */}
      <div className="relative w-full aspect-[9/16] max-w-sm mx-auto bg-black rounded-lg overflow-hidden">
        {/* Video Player */}
        <video
          ref={videoRef}
          src={currentVideo.video_url}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
          controls
          autoPlay={isPlaying}
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={(e) => {
            console.error('Video playback error:', e);
            toast({
              title: "वीडियो प्लेबैक त्रुटि",
              description: "वीडियो चलाने में समस्या हुई",
              variant: "destructive"
            });
          }}
        />

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <Button
              onClick={togglePlay}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-4"
            >
              <Play className="w-8 h-8 text-white fill-current" />
            </Button>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 disabled:opacity-30"
          >
            <ArrowUp className="w-5 h-5 text-white" />
          </Button>
        </div>

        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <Button
            onClick={handleNext}
            disabled={currentIndex === videos.length - 1}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 disabled:opacity-30"
          >
            <ArrowDown className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* Top Controls */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            onClick={toggleMute}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </Button>
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-32 flex flex-col space-y-4">
          <div className="text-center">
            <Button
              onClick={toggleLike}
              className={`bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 mb-1 ${
                likedVideos.has(currentVideo.id) ? 'text-red-500' : 'text-white'
              }`}
            >
              <Heart className={`w-6 h-6 ${likedVideos.has(currentVideo.id) ? 'fill-current' : ''}`} />
            </Button>
            <p className="text-white text-xs">{currentVideo.likes_count || 0}</p>
          </div>
          
          <div className="text-center">
            <Button className="bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 mb-1 text-white">
              <MessageCircle className="w-6 h-6" />
            </Button>
            <p className="text-white text-xs">टिप्पणी</p>
          </div>
          
          <div className="text-center">
            <Button className="bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 mb-1 text-white">
              <Share2 className="w-6 h-6" />
            </Button>
            <p className="text-white text-xs">शेयर</p>
          </div>
        </div>

        {/* Video Info */}
        <div className="absolute bottom-4 left-4 right-20 text-white">
          <div className="space-y-2">
            {/* Mistri info - would need to be fetched separately */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">M</span>
              </div>
              <div>
                <p className="font-semibold text-sm">मिस्त्री</p>
                <p className="text-xs text-gray-300">कामगार</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-sm mb-1">{currentVideo.title}</h3>
              {currentVideo.description && (
                <p className="text-xs text-gray-300 line-clamp-2">{currentVideo.description}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(currentVideo.created_at)} • {currentVideo.views_count || 0} बार देखा गया
              </p>
            </div>
          </div>
        </div>

        {/* Video Counter */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded-full px-3 py-1">
          <span className="text-white text-sm font-medium">
            {currentIndex + 1} / {videos.length}
          </span>
        </div>
      </div>

      {/* Scroll Instructions */}
      <div className="text-center mt-4 text-gray-600 text-sm">
        <p>↑↓ arrows या बटन का उपयोग करके वीडियो बदलें</p>
      </div>
    </div>
  );
};

export default ScrollableVideoFeed;