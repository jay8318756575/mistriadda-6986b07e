
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Star, 
  MapPin, 
  Phone, 
  Calendar, 
  Award,
  User,
  Video,
  Upload
} from "lucide-react";
import { Mistri } from "@/types/mistri";
import VideosList from './VideosList';
import VideoUpload from './VideoUpload';

interface MistriProfileDialogProps {
  mistri: Mistri | null;
  isOpen: boolean;
  onClose: () => void;
}

const MistriProfileDialog = ({ mistri, isOpen, onClose }: MistriProfileDialogProps) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [videoRefreshKey, setVideoRefreshKey] = useState(0);

  // Reset tab when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setActiveTab("profile");
      setShowVideoUpload(false);
    }
  }, [isOpen]);

  const handleVideoUploaded = () => {
    setShowVideoUpload(false);
    setVideoRefreshKey(prev => prev + 1);
    setActiveTab("videos"); // Switch to videos tab to show the new video
  };

  if (!mistri) return null;

  const getVerificationStatus = () => {
    if (mistri.phone_verified && mistri.verification_status === 'verified') {
      return { text: "सत्यापित", color: "bg-green-500" };
    } else if (mistri.verification_status === 'pending') {
      return { text: "लंबित", color: "bg-yellow-500" };
    } else {
      return { text: "असत्यापित", color: "bg-red-500" };
    }
  };

  const verificationStatus = getVerificationStatus();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold">
                {mistri.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <DialogTitle className="text-2xl">{mistri.name}</DialogTitle>
                <DialogDescription className="text-lg">
                  {mistri.category} • {mistri.location}
                </DialogDescription>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={`${verificationStatus.color} text-white`}>
                    {verificationStatus.text}
                  </Badge>
                  {mistri.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{mistri.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>प्रोफाइल</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center space-x-2">
              <Video className="w-4 h-4" />
              <span>वीडियो</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>अपलोड</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-y-auto max-h-[60vh]">
            <TabsContent value="profile" className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>बुनियादी जानकारी</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="font-medium">मोबाइल नंबर</p>
                        <p className="text-gray-600">{mistri.mobile}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="font-medium">स्थान</p>
                        <p className="text-gray-600">{mistri.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="font-medium">अनुभव</p>
                        <p className="text-gray-600">{mistri.experience} साल</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="font-medium">श्रेणी</p>
                        <p className="text-gray-600">{mistri.category}</p>
                      </div>
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
                    <p className="text-gray-700 leading-relaxed">{mistri.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Contact Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>संपर्क करें</CardTitle>
                  <CardDescription>
                    इस मिस्त्री से सीधे संपर्क करने के लिए कॉल करें
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => window.open(`tel:${mistri.mobile}`, '_self')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    कॉल करें: {mistri.mobile}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="videos" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">वीडियो गैलरी</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("upload")}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  नया वीडियो
                </Button>
              </div>
              <VideosList 
                key={videoRefreshKey}
                mistriId={mistri.id} 
                showMistriInfo={false}
              />
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <VideoUpload 
                mistriId={mistri.id}
                onVideoUploaded={handleVideoUploaded}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MistriProfileDialog;
