
import { useState, useEffect } from 'react';
import VideoCard, { type MistriVideo } from './VideoCard';
import VideoPlayerDialog from './VideoPlayerDialog';
import { supabase } from '@/integrations/supabase/client';
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
      
      let query = supabase
        .from('mistri_videos')
        .select(`
          id,
          mistri_id,
          title,
          description,
          video_url,
          thumbnail_url,
          duration,
          views_count,
          likes_count,
          is_active,
          created_at,
          updated_at
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (mistriId) {
        query = query.eq('mistri_id', mistriId);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data: videosData, error: videosError } = await query;

      if (videosError) {
        console.error('Error fetching videos:', videosError);
        toast({
          title: "त्रुटि",
          description: "वीडियो लोड करने में समस्या हुई",
          variant: "destructive"
        });
        return;
      }

      console.log('Videos fetched:', videosData);
      setVideos(videosData || []);

      // Fetch mistri information if needed
      if (showMistriInfo && videosData && videosData.length > 0) {
        const mistriIds = [...new Set(videosData.map(v => v.mistri_id))];
        
        const { data: mistrisData, error: mistrisError } = await supabase
          .from('mistris')
          .select('id, name, category')
          .in('id', mistriIds);

        if (!mistrisError && mistrisData) {
          const mistrisMap = mistrisData.reduce((acc, mistri) => {
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
