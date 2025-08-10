
import { useState, useEffect } from 'react';
import VideoCard, { type MistriVideo } from './VideoCard';
import VideoPlayerDialog from './VideoPlayerDialog';
import { phpClient } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Video } from 'lucide-react';

interface VideosListProps {
  mistriId?: string;
  limit?: number;
  showMistriInfo?: boolean;
  className?: string;
}

const VideosList = ({ 
  mistriId, 
  limit, 
  showMistriInfo = true, 
  className = "" 
}: VideosListProps) => {
  const [videos, setVideos] = useState<MistriVideo[]>([]);
  const [mistris, setMistris] = useState<Record<string, { name: string; category: string }>>({});
  const [selectedVideo, setSelectedVideo] = useState<MistriVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchVideos();
  }, [mistriId, limit]);

  const fetchVideos = async () => {
    try {
      console.log('Fetching videos...', { mistriId, limit });
      
      // Build query parameters
      const filters: any = {};
      if (mistriId) filters.mistri_id = mistriId;
      if (limit) filters.limit = limit;

      // Fetch videos via PHP API
      const result = await phpClient.getVideos(filters);

      if (!result.success) {
        console.error('Error fetching videos:', result.error);
        toast({
          title: "त्रुटि",
          description: "वीडियो लोड करने में समस्या हुई",
          variant: "destructive"
        });
        return;
      }

      console.log('Videos fetched:', result.data);
      setVideos(result.data || []);

      // If showMistriInfo is true, mistri info is already included in PHP response
      if (showMistriInfo && result.data && result.data.length > 0) {
        const mistrisMap = {};
        result.data.forEach(video => {
          if (video.mistri_name) {
            mistrisMap[video.mistri_id] = {
              id: video.mistri_id,
              name: video.mistri_name,
              category: video.category
            };
          }
        });
        setMistris(mistrisMap);
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

  const handleVideoClick = (video: MistriVideo) => {
    setSelectedVideo(video);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>वीडियो लोड हो रहे हैं...</span>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">कोई वीडियो नहीं मिला</p>
        <p className="text-gray-400 text-sm">
          {mistriId ? "इस मिस्त्री के पास अभी तक कोई वीडियो नहीं है" : "अभी तक कोई वीडियो अपलोड नहीं किया गया है"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            mistriName={showMistriInfo ? mistris[video.mistri_id]?.name : undefined}
            onClick={handleVideoClick}
          />
        ))}
      </div>

      <VideoPlayerDialog
        video={selectedVideo}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        mistriName={selectedVideo ? mistris[selectedVideo.mistri_id]?.name : undefined}
        mistriCategory={selectedVideo ? mistris[selectedVideo.mistri_id]?.category : undefined}
      />
    </>
  );
};

export default VideosList;
