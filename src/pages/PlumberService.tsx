import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import { Droplet, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PlumberService = () => {
  return (
    <>
      <Helmet>
        <title>प्लंबर सर्विस - MistriAdda | पानी और नाली की सभी समस्याओं का समाधान</title>
        <meta name="description" content="MistriAdda पर पाएं अनुभवी प्लंबर। पानी का रिसाव, नल की मरम्मत, बाथरूम फिटिंग, सीवर क्लीनिंग, पाइप बदलना और सभी प्लंबिंग समस्याओं का त्वरित समाधान।" />
        <meta name="keywords" content="plumber service, प्लंबर, water leakage, pipe repair, नल मरम्मत, bathroom fitting, drain cleaning, emergency plumber" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-blue-100 p-6 rounded-full mb-6">
                <Droplet className="w-16 h-16 text-blue-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                प्लंबर सर्विस
              </h1>
              <p className="text-lg text-gray-600">
                पानी और नाली की हर समस्या का तुरंत समाधान
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">हमारी प्लंबिंग सेवाएं</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  'पानी का रिसाव ठीक करना',
                  'नल और फॉसेट रिपेयर',
                  'बाथरूम फिटिंग और रिनोवेशन',
                  'किचन सिंक इंस्टॉलेशन',
                  'वॉटर टैंक क्लीनिंग',
                  'सीवर और ड्रेन क्लीनिंग',
                  'पाइप लाइन बदलना',
                  'वॉटर हीटर इंस्टॉलेशन',
                ].map((service) => (
                  <div key={service} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white mb-8">
                <h3 className="text-2xl font-bold mb-4">💧 24/7 आपातकालीन सेवा</h3>
                <p className="mb-4">पानी का रिसाव या अचानक पाइप फटने जैसी समस्या? हम तुरंत पहुंचते हैं!</p>
                <ul className="space-y-2">
                  <li>✓ 30 मिनट में रिस्पांस</li>
                  <li>✓ लाइसेंस्ड और बीमित प्लंबर</li>
                  <li>✓ मॉडर्न टूल्स और उपकरण</li>
                  <li>✓ वर्क वारंटी उपलब्ध</li>
                </ul>
              </div>

              <div className="border-t pt-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">गुणवत्ता की गारंटी</h3>
                <p className="text-gray-700 mb-4">
                  हमारे प्लंबर केवल ISI मार्क पार्ट्स और उच्च गुणवत्ता वाले मटेरियल का उपयोग करते हैं। 
                  सभी काम पर 90 दिन की वारंटी।
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
                    <div className="text-sm text-gray-600">संतुष्ट ग्राहक</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">4.9★</div>
                    <div className="text-sm text-gray-600">ग्राहक रेटिंग</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">10+</div>
                    <div className="text-sm text-gray-600">वर्ष अनुभव</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link to="/">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg">
                  अभी प्लंबर बुक करें
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PlumberService;
