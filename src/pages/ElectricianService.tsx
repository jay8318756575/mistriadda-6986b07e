import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import { Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ElectricianService = () => {
  return (
    <>
      <Helmet>
        <title>इलेक्ट्रिशियन सर्विस - MistriAdda | विश्वसनीय बिजली मरम्मत और वायरिंग</title>
        <meta name="description" content="MistriAdda पर पाएं अनुभवी और सत्यापित इलेक्ट्रिशियन। घर और ऑफिस की सभी प्रकार की बिजली की समस्या, वायरिंग, फैन, स्विच, बोर्ड की मरम्मत। तुरंत बुकिंग करें।" />
        <meta name="keywords" content="electrician service, इलेक्ट्रिशियन, electrical repair, wiring, switch repair, fan installation, बिजली मरम्मत, home electrician" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-yellow-100 p-6 rounded-full mb-6">
                <Zap className="w-16 h-16 text-yellow-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                इलेक्ट्रिशियन सर्विस
              </h1>
              <p className="text-lg text-gray-600">
                घर और ऑफिस की सभी प्रकार की बिजली समस्याओं का समाधान
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">हमारी इलेक्ट्रिशियन सेवाएं</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  'घर की पूर्ण वायरिंग',
                  'स्विच और सॉकेट रिपेयर',
                  'फैन इंस्टालेशन और रिपेयर',
                  'मेन बोर्ड रिपेयर और अपग्रेड',
                  'एलईडी लाइट फिटिंग',
                  'शॉर्ट सर्किट समस्या',
                  'पावर बैकअप इंस्टॉलेशन',
                  'इलेक्ट्रिकल सेफ्टी चेक',
                ].map((service) => (
                  <div key={service} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white mb-8">
                <h3 className="text-2xl font-bold mb-4">⚡ आपातकालीन सेवा उपलब्ध</h3>
                <p className="mb-4">बिजली की अचानक समस्या? हमारे इलेक्ट्रिशियन 24/7 उपलब्ध हैं!</p>
                <ul className="space-y-2">
                  <li>✓ त्वरित रिस्पांस टाइम</li>
                  <li>✓ अनुभवी और सर्टिफाइड इलेक्ट्रिशियन</li>
                  <li>✓ सभी आवश्यक टूल्स और उपकरण</li>
                  <li>✓ वारंटी और गारंटी</li>
                </ul>
              </div>

              <div className="border-t pt-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">सुरक्षा हमारी प्राथमिकता</h3>
                <p className="text-gray-700 mb-4">
                  हमारे सभी इलेक्ट्रिशियन प्रशिक्षित और अनुभवी हैं। वे सभी सुरक्षा नियमों का पालन करते हैं और 
                  आईएसआई मार्क उपकरणों का उपयोग करते हैं।
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                    <div className="text-sm text-gray-600">सफल प्रोजेक्ट्स</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">4.8★</div>
                    <div className="text-sm text-gray-600">औसत रेटिंग</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                    <div className="text-sm text-gray-600">सुरक्षित काम</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link to="/">
                <Button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-8 py-6 text-lg">
                  अभी इलेक्ट्रिशियन बुक करें
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ElectricianService;
