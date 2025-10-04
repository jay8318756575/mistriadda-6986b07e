import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import { Hammer, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CarpenterService = () => {
  return (
    <>
      <Helmet>
        <title>कारपेंटर सर्विस - MistriAdda | फर्नीचर और लकड़ी का काम</title>
        <meta name="description" content="MistriAdda पर पाएं कुशल कारपेंटर। फर्नीचर बनाना, मरम्मत, वॉर्डरोब, किचन कैबिनेट, दरवाजा-खिड़की फिटिंग, मॉड्यूलर फर्नीचर और सभी लकड़ी के काम।" />
        <meta name="keywords" content="carpenter service, कारपेंटर, furniture repair, wardrobe, kitchen cabinet, door fitting, modular furniture, लकड़ी का काम" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-amber-100 p-6 rounded-full mb-6">
                <Hammer className="w-16 h-16 text-amber-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                कारपेंटर सर्विस
              </h1>
              <p className="text-lg text-gray-600">
                फर्नीचर और लकड़ी के काम के विशेषज्ञ
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">हमारी कारपेंटरी सेवाएं</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  'कस्टम फर्नीचर निर्माण',
                  'वॉर्डरोब डिज़ाइन और इंस्टॉलेशन',
                  'किचन कैबिनेट',
                  'बेड और अलमारी रिपेयर',
                  'दरवाजा-खिड़की फिटिंग',
                  'मॉड्यूलर फर्नीचर असेंबली',
                  'फर्नीचर पॉलिशिंग',
                  'टीवी यूनिट और शोकेस',
                ].map((service) => (
                  <div key={service} className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white mb-8">
                <h3 className="text-2xl font-bold mb-4">🪚 प्रीमियम वुडवर्क</h3>
                <p className="mb-4">हमारे कारपेंटर आपके सपनों का फर्नीचर तैयार करते हैं!</p>
                <ul className="space-y-2">
                  <li>✓ कस्टम डिज़ाइन</li>
                  <li>✓ उच्च गुणवत्ता वाली लकड़ी</li>
                  <li>✓ मॉडर्न टूल्स और तकनीक</li>
                  <li>✓ समय पर डिलीवरी</li>
                </ul>
              </div>

              <div className="border-t pt-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">हमारा काम, आपका गर्व</h3>
                <p className="text-gray-700 mb-4">
                  हमारे कारपेंटर अनुभवी और प्रशिक्षित हैं। वे आपके घर और ऑफिस के लिए बेहतरीन 
                  फर्नीचर तैयार करते हैं जो टिकाऊ और सुंदर दोनों है।
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">800+</div>
                    <div className="text-sm text-gray-600">प्रोजेक्ट्स कम्प्लीट</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <div className="text-3xl font-bold text-amber-600 mb-2">4.9★</div>
                    <div className="text-sm text-gray-600">कस्टमर रेटिंग</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
                    <div className="text-sm text-gray-600">वर्ष एक्सपीरियंस</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link to="/">
                <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-6 text-lg">
                  अभी कारपेंटर बुक करें
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CarpenterService;
