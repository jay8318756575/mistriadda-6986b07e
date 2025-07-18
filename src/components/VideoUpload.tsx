
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VideoUploadProps {
  mistriId: string;
  onVideoUploaded?: () => void;
}

const VideoUpload = ({ mistriId, onVideoUploaded }: VideoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload videos smaller than 50MB",
          variant: "destructive"
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Wrong file type",
          description: "Please upload video files only",
          variant: "destructive"
        });
        return;
      }
      
      setVideoFile(file);
    }
  };

  const uploadVideo = async () => {
    if (!videoFile || !title.trim()) {
      toast({
        title: "Incomplete information",
        description: "Please provide both title and video file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      console.log('Starting video upload process...');
      
      // Generate unique filename
      const fileExtension = videoFile.name.split('.').pop();
      const fileName = `${mistriId}/${Date.now()}.${fileExtension}`;
      
      console.log('Uploading file to storage:', fileName);
      
      // Upload video to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('mistri-videos')
        .upload(fileName, videoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Video upload error: ${uploadError.message}`);
      }

      console.log('File uploaded successfully:', uploadData);

      // Get public URL for the video
      const { data: urlData } = supabase.storage
        .from('mistri-videos')
        .getPublicUrl(fileName);

      console.log('Got public URL:', urlData.publicUrl);

      // Create video record in database
      const { data: videoData, error: dbError } = await supabase
        .from('mistri_videos')
        .insert({
          mistri_id: mistriId,
          title: title.trim(),
          description: description.trim() || null,
          video_url: urlData.publicUrl,
          duration: null, // Can be calculated later with video metadata
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database insert error:', dbError);
        // Try to cleanup uploaded file
        await supabase.storage.from('mistri-videos').remove([fileName]);
        throw new Error(`Database save error: ${dbError.message}`);
      }

      console.log('Video record created:', videoData);

      toast({
        title: "Success!",
        description: "Video uploaded successfully",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setVideoFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('video-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Notify parent component
      if (onVideoUploaded) {
        onVideoUploaded();
      }

    } catch (error) {
      console.error('Video upload failed:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Error uploading video",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-md border-2 border-purple-200">
      <div className="flex items-center space-x-2">
        <Video className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Upload New Video</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="video-title" className="block text-sm font-bold text-purple-700 mb-1">
            Title *
          </label>
          <Input
            id="video-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="video-description" className="block text-sm font-bold text-pink-700 mb-1">
            Description
          </label>
          <Textarea
            id="video-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about your video (optional)"
            rows={3}
            maxLength={500}
          />
        </div>

        <div>
          <label htmlFor="video-file-input" className="block text-sm font-bold text-orange-700 mb-1">
            Video File * (Max 50MB)
          </label>
          <div className="relative">
            <Input
              id="video-file-input"
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label
              htmlFor="video-file-input"
              className="flex items-center justify-center w-full p-4 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <div className="text-center">
                <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-purple-600">
                  {videoFile ? videoFile.name : "Click to select video file"}
                </p>
                <p className="text-xs text-purple-400 mt-1">
                  MP4, MOV, AVI, or other video formats
                </p>
              </div>
            </label>
          </div>
        </div>

        <Button
          onClick={uploadVideo}
          disabled={isUploading || !videoFile || !title.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg"
        >
          {isUploading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Uploading...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload Video</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default VideoUpload;
