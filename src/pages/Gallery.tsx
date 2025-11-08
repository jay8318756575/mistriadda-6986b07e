import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Play, User, Briefcase, Heart, Eye, ArrowLeft } from 'lucide-react';
import { phpClient } from '@/lib/php-client';
import { useNavigate } from 'react-router-dom';
import ShortsPlayer from '@/components/ShortsPlayer';
import type { MistriVideo } from '@/components/VideoCard';

interface GalleryItem {
  id: string;
  type: 'video' | 'photo';
  url: string;
  thumbnail?: string;
  title?: string;
  mistri_name?: string;
  mistri_id?: string;
  category?: string;
  created_at: string;
  views?: number;
  likes?: number;
}

const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<MistriVideo | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [activeTab, items]);

  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      // Fetch videos
      const videosResponse = await phpClient.getVideos({ limit: 50 });
      const videos: GalleryItem[] = videosResponse.data?.map((video: any) => ({
        id: video.id,
        type: 'video' as const,
        url: video.video_url,
        title: video.title,
        mistri_name: video.mistri_name,
        mistri_id: video.mistri_id,
        category: video.category,
        created_at: video.created_at,
        views: video.views_count || 0,
        likes: video.likes_count || 0
      })) || [];

      setItems(videos);
    } catch (error) {
      console.error('Failed to fetch gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    if (activeTab === 'all') {
      setFilteredItems(items);
    } else if (activeTab === 'videos') {
      setFilteredItems(items.filter(item => item.type === 'video'));
    } else if (activeTab === 'photos') {
      setFilteredItems(items.filter(item => item.type === 'photo'));
    }
  };

  const handleVideoClick = (item: GalleryItem) => {
    const video: MistriVideo = {
      id: item.id,
      mistri_id: item.mistri_id || '',
      title: item.title || '',
      description: '',
      video_url: item.url,
      views_count: item.views || 0,
      likes_count: item.likes || 0,
      created_at: item.created_at,
      updated_at: item.created_at,
      is_active: true
    };
    setSelectedVideo(video);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-6 px-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              होम पेज
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">वीडियो गैलरी 📸</h1>
          <p className="text-orange-100">मिस्त्रियों के काम की वीडियो और फोटो देखें</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="all" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              सभी
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              <Play className="w-4 h-4 mr-2" />
              वीडियो
            </TabsTrigger>
            <TabsTrigger value="photos" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              फोटो
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">कोई आइटम नहीं मिला</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    onClick={() => item.type === 'video' ? handleVideoClick(item) : setSelectedImage(item.url)}
                  >
                    <div className="relative aspect-[9/16] bg-gray-900">
                      {item.type === 'video' ? (
                        <>
                          <video
                            src={item.url}
                            className="w-full h-full object-cover"
                            muted
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all flex items-center justify-center">
                            <div className="bg-white/90 rounded-full p-4">
                              <Play className="w-8 h-8 text-orange-600 fill-current" />
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                            <p className="text-white text-sm font-semibold line-clamp-2">{item.title}</p>
                            {item.mistri_name && (
                              <p className="text-white/80 text-xs mt-1">{item.mistri_name}</p>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-white/80 text-xs">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {item.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {item.likes}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={item.url}
                            alt="Gallery"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                        </>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Video Player Dialog */}
      {selectedVideo && (
        <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="max-w-md p-0 bg-black">
            <ShortsPlayer
              video={selectedVideo}
              mistriName={selectedVideo.mistri_id}
              isActive={true}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Image Viewer Dialog */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0">
            <img
              src={selectedImage}
              alt="Gallery"
              className="w-full h-auto"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Gallery;
