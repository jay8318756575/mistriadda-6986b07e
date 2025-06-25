
import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Heart, Share2, MessageCircle } from 'lucide-react';
import type { MistriVideo } from './VideoCard';
import { formatDistanceToNow } from 'date-fns';
import { hi } from 'date-fns/locale';

interface ShortsPlayerProps {
  video: MistriVideo;
  mistriName?: string;
  mistriCategory?: string;
  isActive: boolean;
}

const ShortsPlayer = ({ video, mistriName, mistriCategory, isActive }: ShortsPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive && videoRef.current) {
      setIsPlaying(true);
      videoRef.current.play();
    } else if (!isActive && videoRef.current) {
      setIsPlaying(false);
      videoRef.current.pause();
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
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

  return (
    <div className="relative w-full h-screen max-w-md mx-auto bg-black rounded-lg overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        src={video.video_url}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlay}
      />

      {/* Play/Pause overlay */}
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

      {/* Top controls */}
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

      {/* Right side controls */}
      <div className="absolute right-4 bottom-20 flex flex-col space-y-4">
        <div className="text-center">
          <Button
            onClick={() => setLiked(!liked)}
            className={`bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 mb-1 ${
              liked ? 'text-red-500' : 'text-white'
            }`}
          >
            <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
          </Button>
          <p className="text-white text-xs">{video.likes_count}</p>
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

      {/* Bottom info */}
      <div className="absolute bottom-4 left-4 right-20 text-white">
        <div className="space-y-2">
          {mistriName && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">M</span>
              </div>
              <div>
                <p className="font-semibold text-sm">{mistriName}</p>
                {mistriCategory && (
                  <p className="text-xs text-gray-300">{mistriCategory}</p>
                )}
              </div>
            </div>
          )}
          
          <div>
            <h3 className="font-semibold text-sm mb-1">{video.title}</h3>
            {video.description && (
              <p className="text-xs text-gray-300 line-clamp-2">{video.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {formatDate(video.created_at)} • {video.views_count} बार देखा गया
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortsPlayer;
