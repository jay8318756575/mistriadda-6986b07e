import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import { Paintbrush, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PainterService = () => {
  return (
    <>
      <Helmet>
        <title>पेंटर सर्विस - MistriAdda | घर और ऑफिस की पेंटिंग सेवा</title>
        <meta name="description" content="MistriAdda पर पाएं प्रोफेशनल पेंटर। इंटीरियर पेंटिंग, एक्सटीरियर पेंटिंग, वॉल पेंटिंग, वॉटरप्रूफिंग, टेक्सचर पेंट और सभी प्रकार की पेंटिंग सर्विस।" />
        <meta name="keywords" content="painter service, पेंटर, interior painting, exterior painting, wall painting, waterproofing, texture paint, घर की पेंटिंग" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-purple-100 p-6 rounded-full mb-6">
                <Paintbrush className="w-16 h-16 text-purple-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                पेंटर सर्विस
              </h1>
              <p className="text-lg text-gray-600">
                आपके घर को नया रूप देने के विशेषज्ञ
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">हमारी पेंटिंग सेवाएं</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  'इंटीरियर वॉल पेंटिंग',
                  'एक्सटीरियर हाउस पेंटिंग',
                  'टेक्सचर और डेकोरेटिव पेंट',
                  'वॉटरप्रूफिंग सॉल्यूशन',
                  'पुट्टी और स्मूदनिंग',
                  'वुड पॉलिशिंग',
                  'दीवार की सफाई और तैयारी',
                  'रंग कंसल्टेशन',
                ].map((service) => (
                  <div key={service} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white mb-8">
                <h3 className="text-2xl font-bold mb-4">🎨 प्रीमियम पेंटिंग सॉल्यूशन</h3>
                <p className="mb-4">हम केवल ब्रांडेड और इको-फ्रेंडली पेंट का उपयोग करते हैं!</p>
                <ul className="space-y-2">
                  <li>✓ Asian Paints, Berger, Nerolac</li>
                  <li>✓ 100% डस्ट-फ्री पेंटिंग</li>
                  <li>✓ स्मूथ फिनिश गारंटी</li>
                  <li>✓ 2 साल की वारंटी</li>
                </ul>
              </div>

              <div className="border-t pt-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">रंगों से जिंदगी में रंग</h3>
                <p className="text-gray-700 mb-4">
                  हमारे प्रोफेशनल पेंटर आपके घर को नया रूप देते हैं। हम आपके बजट और पसंद के 
                  अनुसार सर्वश्रेष्ठ पेंटिंग सॉल्यूशन प्रदान करते हैं।
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">600+</div>
                    <div className="text-sm text-gray-600">हैप्पी होम्स</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">4.8★</div>
                    <div className="text-sm text-gray-600">कस्टमर रेटिंग</div>
                  </div>
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <div className="text-3xl font-bold text-pink-600 mb-2">12+</div>
                    <div className="text-sm text-gray-600">वर्ष एक्सपीरियंस</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link to="/">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg">
                  अभी पेंटर बुक करें
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PainterService;
