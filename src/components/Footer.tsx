import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Shield, Download } from 'lucide-react';

const serviceLinks = [
  { name: 'इलेक्ट्रीशियन', slug: 'electrician-service' },
  { name: 'प्लंबर', slug: 'plumber-service' },
  { name: 'पेंटर', slug: 'painter-service' },
  { name: 'बढ़ई (Carpenter)', slug: 'carpenter-service' },
  { name: 'राजमिस्त्री (Mason)', slug: 'mason-service' },
  { name: 'मैकेनिक', slug: 'mechanic-service' },
  { name: 'वेल्डर', slug: 'welder-service' },
  { name: 'माली (Gardener)', slug: 'gardener-service' },
  { name: 'सफाई कर्मी', slug: 'cleaner-service' },
  { name: 'ड्राइवर', slug: 'driver-service' },
  { name: 'सिक्योरिटी गार्ड', slug: 'security-service' },
  { name: 'रसोइया (Cook)', slug: 'cook-service' },
  { name: 'प्रॉपर्टी/जमीन', slug: 'property-service' },
  { name: 'कबाड़ी', slug: 'kabadi-service' },
  { name: 'POP सीलिंग', slug: 'pop-ceiling-service' },
  { name: 'जिप्सम बोर्ड', slug: 'gypsum-board-service' },
  { name: 'जंक्शन सीलिंग', slug: 'junction-sealing-service' },
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg p-2">
                <span className="text-xl font-bold">🔧</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                MistriAdda
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              भारत का भरोसेमंद मिस्त्री प्लेटफॉर्म। सभी प्रकार के कुशल कारीगरों को अपने घर पर बुलाएं।
            </p>

            {/* Quick Links */}
            <h4 className="text-lg font-bold text-orange-400 pt-2">त्वरित लिंक</h4>
            <ul className="space-y-1">
              <li><Link to="/" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">होम</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">सेवाएं</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">हमारे बारे में</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">संपर्क करें</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">ब्लॉग</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">FAQ</Link></li>
              <li><Link to="/gallery" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">गैलरी</Link></li>
              <li><Link to="/videos" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">वीडियो</Link></li>
            </ul>
          </div>

          {/* Services Column 1 */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-orange-400">हमारी सेवाएं</h4>
            <ul className="space-y-1">
              {serviceLinks.slice(0, 9).map((s) => (
                <li key={s.slug}>
                  <Link to={`/${s.slug}`} className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column 2 */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-orange-400">अन्य सेवाएं</h4>
            <ul className="space-y-1">
              {serviceLinks.slice(9).map((s) => (
                <li key={s.slug}>
                  <Link to={`/${s.slug}`} className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Legal */}
            <h4 className="text-lg font-bold mb-2 mt-6 text-orange-400">कानूनी</h4>
            <ul className="space-y-1">
              <li>
                <Link to="/privacy-policy" className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors text-sm">
                  <Shield className="w-3 h-3" /> गोपनीयता नीति
                </Link>
              </li>
              <li>
                <Link to="/download" className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors text-sm">
                  <Download className="w-3 h-3" /> ऐप डाउनलोड
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-orange-400">संपर्क करें</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-orange-400" />
                <a href="tel:+919999999999" className="hover:text-orange-400 transition-colors">+91 99999 99999</a>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-orange-400" />
                <a href="mailto:support@mistriadda.com" className="hover:text-orange-400 transition-colors">support@mistriadda.com</a>
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-orange-400 mt-0.5" />
                <span>उत्तर प्रदेश, भारत</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} MistriAdda. सर्वाधिकार सुरक्षित।
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
