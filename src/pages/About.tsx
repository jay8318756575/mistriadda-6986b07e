import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import { Users, Target, Award, Heart } from 'lucide-react';

const About = () => {
  return (
    <>
      <Helmet>
        <title>हमारे बारे में - MistriAdda | भारत का सबसे बड़ा मिस्त्री प्लेटफॉर्म</title>
        <meta name="description" content="MistriAdda के बारे में जानें - हम भारत में सभी प्रकार के मिस्त्री और होम सर्विस प्रोवाइडर को एक प्लेटफॉर्म पर लाते हैं। हमारा मिशन, विज़न और मूल्य जानें।" />
        <meta name="keywords" content="MistriAdda, Mistri Adda, About us, हमारे बारे में, company information, मिस्त्री प्लेटफॉर्म, home services India" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              हमारे बारे में - MistriAdda
            </h1>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <strong>MistriAdda</strong> भारत का सबसे भरोसेमंद मिस्त्री सर्विस प्लेटफॉर्म है। हम सभी प्रकार के स्किल्ड वर्कर्स - प्लंबर, इलेक्ट्रिशियन, कारपेंटर, पेंटर, मैकेनिक और अन्य मिस्त्रियों को एक डिजिटल प्लेटफॉर्म पर लाते हैं।
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                हमारा उद्देश्य है कि हर व्यक्ति को अपने घर की किसी भी समस्या के लिए आसानी से और जल्दी से विश्वसनीय मिस्त्री मिल सके। हम तकनीक का उपयोग करके पारंपरिक होम सर्विसेज को आधुनिक और सुविधाजनक बना रहे हैं।
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">हमारा मिशन</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  हर भारतीय घर में होम सर्विसेज को आसान, भरोसेमंद और किफायती बनाना। हम चाहते हैं कि मिस्त्री ढूंढना उतना ही आसान हो जितना कि मोबाइल पर एक ऐप खोलना।
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <Award className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">हमारी विशेषता</h2>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ सत्यापित और अनुभवी मिस्त्री</li>
                  <li>✓ वीडियो प्रोफाइल के साथ पारदर्शिता</li>
                  <li>✓ रेटिंग और रिव्यू सिस्टम</li>
                  <li>✓ त्वरित बुकिंग और सपोर्ट</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">हमारी टीम</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  हमारी टीम युवा उद्यमियों, टेक्नोलॉजी एक्सपर्ट्स और इंडस्ट्री प्रोफेशनल्स से बनी है जो भारत में होम सर्विसेज सेक्टर में क्रांति लाने के लिए समर्पित हैं।
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">हमारे मूल्य</h2>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>💪 ईमानदारी और पारदर्शिता</li>
                  <li>🤝 ग्राहक संतुष्टि</li>
                  <li>⚡ गुणवत्ता सेवा</li>
                  <li>🌟 निरंतर सुधार</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-xl p-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">हमसे जुड़ें</h2>
              <p className="text-lg mb-6">
                चाहे आप मिस्त्री हों या कस्टमर, MistriAdda आपके लिए बेहतरीन अवसर लेकर आता है।
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
                  मिस्त्री बनें
                </button>
                <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-orange-600 transition-colors">
                  सर्विस बुक करें
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default About;
