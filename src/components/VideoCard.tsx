
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Eye, Heart, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { hi } from 'date-fns/locale';

export interface MistriVideo {
  id: string;
  mistri_id: string;
  title: string;
  description?: string;
  video_url: string;
  duration?: number;
  views_count: number;
  likes_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface VideoCardProps {
  video: MistriVideo;
  mistriName?: string;
  onClick?: (video: MistriVideo) => void;
  className?: string;
}

const VideoCard = ({ video, mistriName, onClick, className = "" }: VideoCardProps) => {
  const [imageError, setImageError] = useState(false);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  const getThumbnail = () => {
    // Since we don't have thumbnail_url, use a placeholder
    return '/placeholder.svg';
  };

  return (
    <Card 
      className={`group cursor-pointer hover:shadow-lg transition-all duration-300 ${className}`}
      onClick={() => onClick?.(video)}
    >
      <CardContent className="p-0">
        {/* Video Thumbnail */}
        <div className="relative aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
          <img
            src={getThumbnail()}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white bg-opacity-90 rounded-full p-3">
              <Play className="w-6 h-6 text-orange-600 fill-current" />
            </div>
          </div>
          
          {/* Duration badge */}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {formatDuration(video.duration)}
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
              {video.title}
            </h3>
            {mistriName && (
              <p className="text-sm text-gray-600 mt-1">{mistriName}</p>
            )}
          </div>
          
          {video.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {video.description}
            </p>
          )}
          
          {/* Video stats */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{video.views_count}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>{video.likes_count}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(video.created_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
