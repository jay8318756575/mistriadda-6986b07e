
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MapPin, 
  Phone, 
  Star, 
  Calendar,
  User,
  Upload,
  Video,
  Edit
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { hi } from 'date-fns/locale';
import type { Mistri } from '@/types/mistri';
import VideoUpload from './VideoUpload';
import EditProfileDialog from './EditProfileDialog';
import { Link } from 'react-router-dom';

interface MistriProfileDialogProps {
  mistri: Mistri | null;
  isOpen: boolean;
  onClose: () => void;
}

const MistriProfileDialog = ({ mistri, isOpen, onClose }: MistriProfileDialogProps) => {
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentMistri, setCurrentMistri] = useState<Mistri | null>(mistri);

  useEffect(() => {
    setCurrentMistri(mistri);
  }, [mistri]);

  useEffect(() => {
    if (!isOpen) {
      setShowVideoUpload(false);
      setShowEditDialog(false);
    }
  }, [isOpen]);

  if (!currentMistri) return null;

  const formatJoinDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: hi 
      });
    } catch {
      return 'कुछ समय पहले';
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="relative bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center overflow-hidden border-4 border-orange-200 shadow-lg">
              {mistri.profile_photo_url ? (
                <img 
                  src={mistri.profile_photo_url} 
                  alt={mistri.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallback = document.createElement('span');
                      fallback.className = 'text-2xl font-bold';
                      fallback.textContent = mistri.name.charAt(0);
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <span className="text-2xl font-bold">{mistri.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{mistri.name}</h2>
              <p className="text-gray-600">{mistri.category}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Upload Section - Prominently displayed at top */}
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Video className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-lg text-orange-800">वीडियो सेक्शन</CardTitle>
                </div>
              </div>
              <CardDescription className="text-orange-700">
                अपने काम के वीडियो अपलोड करें या देखें
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setShowVideoUpload(!showVideoUpload)}
                  className="bg-orange-600 hover:bg-orange-700 text-white flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {showVideoUpload ? 'अपलोड छुपाएं' : 'नया वीडियो अपलोड करें'}
                </Button>
                <Link to="/videos" className="flex-1">
                  <Button 
                    variant="outline" 
                    className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    सभी वीडियो देखें
                  </Button>
                </Link>
              </div>
              
              {showVideoUpload && (
                <div className="mt-4 p-4 bg-white rounded-lg border">
                  <VideoUpload 
                    mistriId={mistri.id} 
                    onVideoUploaded={() => setShowVideoUpload(false)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="profile">प्रोफाइल विवरण</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              {/* Profile Photo Section */}
              {mistri.profile_photo_url && (
                <Card className="bg-gradient-to-br from-orange-50 to-red-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-orange-600" />
                      <span>प्रोफाइल फोटो</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                        <img 
                          src={mistri.profile_photo_url} 
                          alt={mistri.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mistri.name)}&size=200&background=ea580c&color=fff&bold=true`;
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-orange-600" />
                    <span>बुनियादी जानकारी</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        नाम
                      </label>
                      <p className="text-gray-900 font-medium">{mistri.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        श्रेणी
                      </label>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        {mistri.category}
                      </Badge>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        अनुभव
                      </label>
                      <p className="text-gray-900">{mistri.experience} साल</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        रेटिंग
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {getRatingStars(mistri.rating || 0)}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({mistri.rating || 0}/5)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-orange-600" />
                    <span>संपर्क जानकारी</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        फोन नंबर
                      </label>
                      <p className="text-gray-900 font-medium">{mistri.phone || mistri.mobile}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        स्थान
                      </label>
                      <p className="text-gray-900 flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                        {mistri.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              {mistri.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>विवरण</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {mistri.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Additional Info */}
              <Card>
                <CardHeader>
                  <CardTitle>अतिरिक्त जानकारी</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        शामिल हुए
                      </label>
                      <p className="text-gray-900 flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                        {formatJoinDate(mistri.created_at || new Date().toISOString())}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        सत्यापन स्थिति
                      </label>
                      <Badge 
                        variant={mistri.phone_verified ? "default" : "secondary"}
                        className={mistri.phone_verified ? "bg-green-600" : "bg-gray-500"}
                      >
                        {mistri.phone_verified ? "सत्यापित" : "अस्सत्यापित"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>

      {/* Edit Profile Dialog */}
      {showEditDialog && (
        <EditProfileDialog
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          mistri={currentMistri}
          onProfileUpdated={(updatedProfile) => {
            setCurrentMistri(updatedProfile);
            setShowEditDialog(false);
          }}
        />
      )}
    </Dialog>
  );
};

export default MistriProfileDialog;
