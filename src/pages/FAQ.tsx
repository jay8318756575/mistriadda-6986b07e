import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      question: 'MistriAdda क्या है?',
      answer: 'MistriAdda एक ऑनलाइन प्लेटफॉर्म है जहाँ आप सभी प्रकार के मिस्त्री - प्लंबर, इलेक्ट्रिशियन, कारपेंटर, पेंटर आदि को आसानी से ढूंढ सकते हैं और बुक कर सकते हैं।'
    },
    {
      question: 'मिस्त्री कैसे बुक करें?',
      answer: 'आप हमारी वेबसाइट पर अपनी जरूरत की सेवा चुनें, अपने एरिया में उपलब्ध मिस्त्रियों को देखें, उनकी रेटिंग चेक करें और सीधे कॉल करके बुक करें।'
    },
    {
      question: 'क्या सभी मिस्त्री सत्यापित हैं?',
      answer: 'जी हाँ, हमारे प्लेटफॉर्म पर सभी मिस्त्री सत्यापित और अनुभवी हैं। हम उनके दस्तावेज़ और अनुभव की पूरी जांच करते हैं।'
    },
    {
      question: 'सर्विस चार्ज कैसे तय होता है?',
      answer: 'सर्विस चार्ज काम के प्रकार, समय और मटेरियल पर निर्भर करता है। हर मिस्त्री अपनी रेट बताता है। आप कई मिस्त्रियों से बात करके सबसे अच्छा ऑप्शन चुन सकते हैं।'
    },
    {
      question: 'आपातकालीन सेवा उपलब्ध है?',
      answer: 'हाँ, हमारे कई मिस्त्री 24/7 आपातकालीन सेवा प्रदान करते हैं, खासकर प्लंबर और इलेक्ट्रिशियन के लिए।'
    },
    {
      question: 'क्या वारंटी मिलती है?',
      answer: 'हाँ, अधिकतर सेवाओं पर 30-90 दिन की वारंटी मिलती है। यह मिस्त्री और काम के प्रकार पर निर्भर करता है।'
    },
    {
      question: 'पेमेंट कैसे करें?',
      answer: 'आप कैश, UPI, या ऑनलाइन पेमेंट से भुगतान कर सकते हैं। कुछ मिस्त्री एडवांस लेते हैं, कुछ काम पूरा होने के बाद।'
    },
    {
      question: 'अगर काम से संतुष्ट न हों तो?',
      answer: 'आप हमें शिकायत कर सकते हैं। हम समस्या सुलझाने में मदद करते हैं और जरूरत पड़ने पर दूसरे मिस्त्री की व्यवस्था करते हैं।'
    },
    {
      question: 'मैं खुद मिस्त्री हूँ, कैसे रजिस्टर करूं?',
      answer: 'आप हमारी वेबसाइट पर "मिस्त्री बनें" पर क्लिक करके अपनी प्रोफाइल बना सकते हैं। हम आपके दस्तावेज़ सत्यापित करेंगे और आपको प्लेटफॉर्म पर जोड़ देंगे।'
    },
    {
      question: 'रेटिंग और रिव्यू कैसे काम करता है?',
      answer: 'हर सर्विस के बाद कस्टमर्स मिस्त्री को रेटिंग (1-5 स्टार) और रिव्यू दे सकते हैं। यह अन्य यूज़र्स को सही मिस्त्री चुनने में मदद करता है।'
    }
  ];

  return (
    <>
      <Helmet>
        <title>अक्सर पूछे जाने वाले प्रश्न (FAQ) - MistriAdda</title>
        <meta name="description" content="MistriAdda के बारे में अक्सर पूछे जाने वाले प्रश्न और उनके उत्तर। मिस्त्री बुकिंग, सर्विस चार्ज, वारंटी, पेमेंट और अन्य सवालों के जवाब।" />
        <meta name="keywords" content="FAQ, frequently asked questions, MistriAdda help, सवाल जवाब, मिस्त्री कैसे बुक करें, service charges" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-orange-100 p-6 rounded-full mb-6">
                <HelpCircle className="w-16 h-16 text-orange-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                अक्सर पूछे जाने वाले प्रश्न
              </h1>
              <p className="text-lg text-gray-600">
                MistriAdda के बारे में आपके सभी सवालों के जवाब
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-semibold text-gray-800">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="mt-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">और कोई सवाल?</h2>
              <p className="mb-6">
                अगर आपको यहाँ अपने सवाल का जवाब नहीं मिला, तो हमसे संपर्क करें
              </p>
              <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
                हमसे संपर्क करें
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default FAQ;
