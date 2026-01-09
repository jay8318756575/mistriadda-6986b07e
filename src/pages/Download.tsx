import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Smartphone, Share2, CheckCircle, ArrowRight, Shield, Zap, Wifi } from 'lucide-react';
import Header from '@/components/Header';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DownloadPage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check device type
    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(/android/.test(userAgent));
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'MistriAdda - मिस्त्री ऐप',
      text: 'अभी MistriAdda डाउनलोड करें - भारत का सबसे भरोसेमंद मिस्त्री ऐप!',
      url: window.location.origin + '/download'
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy link
        await navigator.clipboard.writeText(shareData.url);
        alert('लिंक कॉपी हो गया!');
      }
    } catch (err) {
      console.log('Share failed:', err);
    }
  };

  const features = [
    { icon: Zap, title: 'तेज़ और आसान', desc: 'एक क्लिक में मिस्त्री खोजें' },
    { icon: Shield, title: 'सत्यापित मिस्त्री', desc: 'सभी मिस्त्री वेरिफाइड' },
    { icon: Wifi, title: 'ऑफलाइन भी', desc: 'बिना इंटरनेट भी काम करे' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-lg">
        {/* App Icon */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="w-28 h-28 bg-white rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img 
                src="/icon-192.png" 
                alt="MistriAdda" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">MistriAdda</h1>
            <p className="text-white/90 font-medium">भारत का #1 मिस्त्री ऐप</p>
          </div>
        </div>

        {/* Install Card */}
        <Card className="bg-white/95 backdrop-blur shadow-2xl border-0 mb-6 overflow-hidden">
          <div className="p-6">
            {isInstalled ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">ऐप इंस्टॉल हो गया! 🎉</h2>
                <p className="text-gray-600">अब आप होम स्क्रीन से ऐप खोल सकते हैं</p>
              </div>
            ) : (
              <>
                {deferredPrompt ? (
                  <Button 
                    onClick={handleInstall}
                    className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg rounded-xl shadow-lg"
                  >
                    <Download className="w-6 h-6 mr-3" />
                    अभी इंस्टॉल करें (Free)
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                      <h3 className="font-bold text-orange-800 mb-2 flex items-center">
                        <Smartphone className="w-5 h-5 mr-2" />
                        कैसे इंस्टॉल करें?
                      </h3>
                      
                      {isIOS ? (
                        <ol className="text-sm text-gray-700 space-y-2">
                          <li className="flex items-start">
                            <span className="bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                            Safari में Share बटन दबाएं (⬆️)
                          </li>
                          <li className="flex items-start">
                            <span className="bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                            "Add to Home Screen" चुनें
                          </li>
                          <li className="flex items-start">
                            <span className="bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                            "Add" पर क्लिक करें
                          </li>
                        </ol>
                      ) : (
                        <ol className="text-sm text-gray-700 space-y-2">
                          <li className="flex items-start">
                            <span className="bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                            Chrome में ⋮ मेन्यू खोलें
                          </li>
                          <li className="flex items-start">
                            <span className="bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                            "Install app" या "Add to Home Screen" चुनें
                          </li>
                          <li className="flex items-start">
                            <span className="bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                            "Install" पर क्लिक करें
                          </li>
                        </ol>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Share Button */}
        <Card className="bg-white/95 backdrop-blur shadow-xl border-0 mb-6">
          <div className="p-4">
            <Button 
              onClick={handleShare}
              variant="outline"
              className="w-full h-12 border-2 border-orange-400 text-orange-600 hover:bg-orange-50 font-bold rounded-xl"
            >
              <Share2 className="w-5 h-5 mr-2" />
              APK लिंक शेयर करें
            </Button>
            <p className="text-center text-xs text-gray-500 mt-2">
              यह लिंक किसी को भी भेजें - वो भी ऐप डाउनलोड कर सकते हैं
            </p>
          </div>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="bg-white/90 backdrop-blur border-0 shadow-lg p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 text-xs mb-1">{feature.title}</h3>
              <p className="text-gray-500 text-[10px]">{feature.desc}</p>
            </Card>
          ))}
        </div>

        {/* Continue to Website */}
        <div className="text-center">
          <a 
            href="/" 
            className="inline-flex items-center text-white/90 hover:text-white font-medium transition-colors"
          >
            वेबसाइट पर जारी रखें
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>
      </main>
    </div>
  );
};

export default DownloadPage;
