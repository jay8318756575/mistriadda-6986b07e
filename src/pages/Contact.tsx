import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "संदेश भेजा गया!",
      description: "हम जल्द ही आपसे संपर्क करेंगे।",
    });
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <>
      <Helmet>
        <title>संपर्क करें - MistriAdda | हमसे जुड़ें, सहायता और सपोर्ट</title>
        <meta name="description" content="MistriAdda से संपर्क करें - किसी भी सवाल, सुझाव या सहायता के लिए। हमारी टीम 24/7 आपकी मदद के लिए तैयार है। फोन, ईमेल या फॉर्म के माध्यम से संपर्क करें।" />
        <meta name="keywords" content="contact MistriAdda, संपर्क करें, customer support, help, सहायता, phone number, email, address" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            हमसे संपर्क करें
          </h1>
          
          <p className="text-center text-gray-600 text-lg mb-12">
            कोई सवाल? हम यहाँ मदद के लिए हैं!
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">संदेश भेजें</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">नाम *</label>
                  <Input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="अपना नाम दर्ज करें"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">ईमेल *</label>
                  <Input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">फोन नंबर *</label>
                  <Input 
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="10 अंकों का मोबाइल नंबर"
                    pattern="[0-9]{10}"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">संदेश *</label>
                  <Textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="अपना संदेश लिखें..."
                    rows={5}
                  />
                </div>
                
                <Button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-red-600">
                  संदेश भेजें
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">संपर्क जानकारी</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Phone className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">फोन नंबर</h3>
                      <a href="tel:+919876543210" className="text-gray-600 hover:text-orange-600">
                        +91 98765 43210
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <Mail className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">ईमेल</h3>
                      <a href="mailto:support@mistriadda.com" className="text-gray-600 hover:text-orange-600">
                        support@mistriadda.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">पता</h3>
                      <p className="text-gray-600">
                        123, टेक पार्क<br />
                        नई दिल्ली, भारत - 110001
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">काम के घंटे</h3>
                      <p className="text-gray-600">
                        सोमवार - शुक्रवार: 9:00 AM - 6:00 PM<br />
                        शनिवार - रविवार: 10:00 AM - 4:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">तुरंत सहायता चाहिए?</h3>
                <p className="mb-6">हमारी कस्टमर सपोर्ट टीम आपकी मदद के लिए तैयार है</p>
                <Button className="bg-white text-orange-600 hover:bg-gray-100 font-bold">
                  अभी कॉल करें
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Contact;
