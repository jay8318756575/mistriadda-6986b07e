import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { Shield, Lock, Eye, UserCheck, Phone, FileText } from "lucide-react";
import { Helmet } from "react-helmet";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>गोपनीयता नीति | MistriAdda - Privacy Policy</title>
        <meta name="description" content="MistriAdda की गोपनीयता नीति - आपकी जानकारी कैसे सुरक्षित रखी जाती है। Privacy Policy of MistriAdda." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <Header />
        
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              गोपनीयता नीति
            </h1>
            <p className="text-lg text-gray-600">
              Privacy Policy - आपकी जानकारी की सुरक्षा हमारी प्राथमिकता है
            </p>
            <p className="text-sm text-gray-500 mt-2">
              अंतिम अपडेट: जनवरी 2025
            </p>
          </div>
          
          {/* Policy Sections */}
          <div className="space-y-6">
            {/* Introduction */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">परिचय (Introduction)</h2>
                    <p className="text-gray-600 leading-relaxed">
                      MistriAdda ("हम", "हमारा") में आपका स्वागत है। यह गोपनीयता नीति बताती है कि हम आपकी 
                      व्यक्तिगत जानकारी कैसे एकत्र, उपयोग और सुरक्षित करते हैं। हमारी सेवाओं का उपयोग करके, 
                      आप इस नीति से सहमत होते हैं।
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Data Collection */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">हम क्या जानकारी एकत्र करते हैं</h2>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold">•</span>
                        <span><strong>व्यक्तिगत जानकारी:</strong> नाम, फ़ोन नंबर, पता, अनुभव</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold">•</span>
                        <span><strong>प्रोफ़ाइल फ़ोटो:</strong> आपकी पहचान के लिए</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold">•</span>
                        <span><strong>काम के फ़ोटो/वीडियो:</strong> आपके काम को प्रदर्शित करने के लिए</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold">•</span>
                        <span><strong>स्थान:</strong> आपके नज़दीकी ग्राहकों से जोड़ने के लिए</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Data Usage */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">हम आपकी जानकारी का उपयोग कैसे करते हैं</h2>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>आपकी प्रोफ़ाइल बनाने और प्रदर्शित करने के लिए</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>ग्राहकों को आपसे संपर्क करने में मदद करने के लिए</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>सेवा में सुधार और नई सुविधाएं जोड़ने के लिए</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>आपको महत्वपूर्ण अपडेट भेजने के लिए</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Data Protection */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Lock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">डेटा सुरक्षा (Data Protection)</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      हम आपकी जानकारी की सुरक्षा को गंभीरता से लेते हैं:
                    </p>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold">🔒</span>
                        <span>सुरक्षित सर्वर पर डेटा स्टोरेज</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold">🔒</span>
                        <span>एन्क्रिप्टेड डेटा ट्रांसमिशन</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold">🔒</span>
                        <span>नियमित सुरक्षा ऑडिट</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold">🔒</span>
                        <span>तीसरे पक्ष को डेटा बेचा नहीं जाता</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Your Rights */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">आपके अधिकार (Your Rights)</h2>
                    <ul className="text-gray-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">→</span>
                        <span>अपनी जानकारी देखने और संपादित करने का अधिकार</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">→</span>
                        <span>अपना अकाउंट डिलीट करने का अधिकार</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">→</span>
                        <span>अपनी जानकारी की कॉपी मांगने का अधिकार</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">→</span>
                        <span>प्रमोशनल मैसेज से ऑप्ट-आउट करने का अधिकार</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Contact */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-3">संपर्क करें (Contact Us)</h2>
                    <p className="leading-relaxed mb-4">
                      किसी भी प्रश्न या चिंता के लिए हमसे संपर्क करें:
                    </p>
                    <div className="space-y-2">
                      <p>📧 Email: support@mistriadda.com</p>
                      <p>📞 Phone: +91 9999999999</p>
                      <p>🌐 Website: www.mistriadda.com</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Footer Note */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>© 2025 MistriAdda. सर्वाधिकार सुरक्षित।</p>
            <p className="mt-1">यह नीति समय-समय पर अपडेट की जा सकती है।</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
