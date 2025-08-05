
import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Heart, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { hi } from 'date-fns/locale';
import { phpClient } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { MistriVideo } from './VideoCard';

interface VideoPlayerDialogProps {
  video: MistriVideo | null;
  isOpen: boolean;
  onClose: () => void;
  mistriName?: string;
  mistriCategory?: string;
}

const VideoPlayerDialog = ({ 
  video, 
  isOpen, 
  onClose, 
  mistriName, 
  mistriCategory 
}: VideoPlayerDialogProps) => {
  const [hasViewed, setHasViewed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(0);
  const [localViews, setLocalViews] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

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

  const incrementViews = async () => {
    if (!video || hasViewed) return;
    
    try {
      // For now, just update locally since we don't have PHP endpoint for views
      setLocalViews(video.views_count + 1);
      setHasViewed(true);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const toggleLike = async () => {
    if (!video) return;
    
    try {
      const newLikeCount = isLiked 
        ? Math.max(0, (localLikes || video.likes_count) - 1)
        : (localLikes || video.likes_count) + 1;

      // For now, just update locally since we don't have PHP endpoint for likes
      setIsLiked(!isLiked);
      setLocalLikes(newLikeCount);
      
      toast({
        title: isLiked ? "लाइक हटाया गया" : "लाइक किया गया",
        description: isLiked ? "आपने इस वीडियो को अनलाइक किया" : "आपने इस वीडियो को लाइक किया",
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "त्रुटि",
        description: "लाइक करने में समस्या हुई",
        variant: "destructive"
      });
    }
  };

  const handleVideoPlay = () => {
    incrementViews();
  };

  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-left">{video.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Video Player */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={video.video_url}
              controls
              className="w-full h-full object-contain"
              onPlay={handleVideoPlay}
              preload="metadata"
            >
              आपका ब्राउज़र वीडियो प्लेबैक को सपोर्ट नहीं करता।
            </video>
          </div>

          {/* Video Info */}
          <div className="space-y-4">
            {/* Mistri Info */}
            {mistriName && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{mistriName}</p>
                  {mistriCategory && (
                    <p className="text-sm text-gray-600">{mistriCategory}</p>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {video.description && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">विवरण</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {video.description}
                </p>
              </div>
            )}

            {/* Stats and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{localViews || video.views_count} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(video.created_at)}</span>
                </div>
              </div>
              
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={toggleLike}
                className={isLiked ? "bg-red-600 hover:bg-red-700" : ""}
              >
                <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {localLikes || video.likes_count}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerDialog;
