import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollableVideoFeed from '@/components/ScrollableVideoFeed';
import VideoUpload from '@/components/VideoUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const VideoFeed = () => {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  वापस
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Video className="w-6 h-6 text-orange-600" />
                <h1 className="text-xl font-bold text-gray-800">वीडियो फीड</h1>
              </div>
            </div>
            
            <Button
              onClick={() => setShowUpload(!showUpload)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              वीडियो अपलोड करें
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Feed */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  मिस्त्री वीडियो फीड
                </h2>
                <p className="text-gray-600">
                  अपने काम की वीडियो देखें और अपने हुनर दिखाएं
                </p>
              </div>
              
              <ScrollableVideoFeed />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upload Section */}
            {showUpload && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="w-5 h-5 text-orange-600" />
                    <span>नई वीडियो अपलोड करें</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VideoUpload 
                    mistriId="demo_mistri_1" 
                    onVideoUploaded={() => {
                      setShowUpload(false);
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">वीडियो नेवीगेशन</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">↑↓</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    ऊपर/नीचे बटन से वीडियो बदलें
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">▶</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    वीडियो पर क्लिक करके प्ले/पॉज़ करें
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold">♥</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    लाइक, कमेंट और शेयर करें
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">वीडियो टिप्स</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• साफ और अच्छी quality की वीडियो अपलोड करें</p>
                  <p>• अपने काम की प्रक्रिया दिखाएं</p>
                  <p>• छोटी और informative वीडियो बनाएं</p>
                  <p>• अपना नाम और contact details शामिल करें</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoFeed;