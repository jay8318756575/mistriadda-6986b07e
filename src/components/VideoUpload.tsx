
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadVideo, saveVideo } from '@/lib/supabase-helpers';

interface VideoUploadProps {
  mistriId: string;
  onVideoUploaded?: () => void;
  onRefreshVideos?: () => void;
}

const VideoUpload = ({ mistriId, onVideoUploaded, onRefreshVideos }: VideoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type only - no size restrictions
      if (!file.type.startsWith('video/')) {
        toast({
          title: "गलत फ़ाइल प्रकार",
          description: "कृपया केवल वीडियो फ़ाइलें अपलोड करें",
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
        title: "अनुपूर्ण जानकारी",
        description: "कृपया शीर्षक और वीडियो फ़ाइल दोनों प्रदान करें",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      console.log('Starting video upload via PHP...');
      console.log('Video file details:', {
        name: videoFile.name,
        size: videoFile.size,
        type: videoFile.type
      });
      console.log('Mistri ID:', mistriId);
      
      // Create form data for PHP upload
      const formData = new FormData();
      formData.append('video', videoFile, videoFile.name);
      formData.append('mistri_id', mistriId);
      formData.append('title', title.trim());
      if (description.trim()) {
        formData.append('description', description.trim());
      }

      // Log FormData contents for debugging
      console.log('📤 FormData being sent:');
      console.log('- Mistri ID:', mistriId);
      console.log('- Title:', title.trim());
      console.log('- Description:', description.trim());
      console.log('- Video file:', {
        name: videoFile.name,
        size: videoFile.size + ' bytes (' + (videoFile.size / (1024 * 1024)).toFixed(2) + ' MB)',
        type: videoFile.type
      });

      console.log('Uploading video to Supabase storage...');

      // Upload video file to Supabase Storage
      const videoUrl = await uploadVideo(videoFile, mistriId);
      
      console.log('Video uploaded to storage, URL:', videoUrl);
      console.log('Saving metadata to database...');
      
      // Save video metadata to database
      await saveVideo({
        mistri_id: mistriId,
        title: title.trim(),
        description: description.trim(),
        video_url: videoUrl
      });

      console.log('Video saved successfully');

      toast({
        title: "सफल!",
        description: "वीडियो सफलतापूर्वक अपलोड हो गया",
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
      
      // Refresh video list
      if (onRefreshVideos) {
        onRefreshVideos();
      }
      
      // Dispatch custom event for global video refresh
      window.dispatchEvent(new CustomEvent('videoUploaded'));

    } catch (error) {
      console.error('Video upload failed:', error);
      
      let errorMessage = "वीडियो अपलोड करने में समस्या हुई";
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = "नेटवर्क कनेक्शन में समस्या। कृपया इंटरनेट कनेक्शन चेक करें।";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "त्रुटि",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-2">
        <Video className="w-5 h-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-800">नया वीडियो अपलोड करें</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="video-title" className="block text-sm font-medium text-gray-700 mb-1">
            शीर्षक *
          </label>
          <Input
            id="video-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="वीडियो का शीर्षक दर्ज करें"
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="video-description" className="block text-sm font-medium text-gray-700 mb-1">
            विवरण
          </label>
          <Textarea
            id="video-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="वीडियो के बारे में बताएं (वैकल्पिक)"
            rows={3}
            maxLength={500}
          />
        </div>

        <div>
          <label htmlFor="video-file-input" className="block text-sm font-medium text-gray-700 mb-1">
            वीडियो फ़ाइल * (कोई साइज़ लिमिट नहीं)
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
              className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition-colors"
            >
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {videoFile ? videoFile.name : "वीडियो फ़ाइल चुनने के लिए क्लिक करें"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  MP4, MOV, AVI, या अन्य वीडियो फॉर्मेट
                </p>
              </div>
            </label>
          </div>
        </div>

        <Button
          onClick={uploadVideo}
          disabled={isUploading || !videoFile || !title.trim()}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          {isUploading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>अपलोड हो रहा है...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>वीडियो अपलोड करें</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default VideoUpload;
