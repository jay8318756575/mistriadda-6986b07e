import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import { categories } from '@/data/categories';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <>
      <Helmet>
        <title>हमारी सेवाएं - MistriAdda | सभी प्रकार के मिस्त्री और होम सर्विसेज</title>
        <meta name="description" content="MistriAdda पर उपलब्ध सभी सेवाएं - प्लंबर, इलेक्ट्रिशियन, कारपेंटर, पेंटर, मैकेनिक, AC रिपेयर, क्लीनिंग और अन्य होम सर्विसेज। अपनी जरूरत की सेवा चुनें।" />
        <meta name="keywords" content="home services, plumber service, electrician service, carpenter service, painter service, mechanic service, AC repair, cleaning service, मिस्त्री सेवाएं" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            हमारी सेवाएं
          </h1>
          
          <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            MistriAdda पर आपको मिलेंगी सभी प्रकार की होम सर्विसेज। हमारे सभी मिस्त्री सत्यापित और अनुभवी हैं।
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {categories.map((category) => (
              <Link to="/" key={category.id}>
                <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{category.nameHindi}</h3>
                    <p className="text-gray-600 text-sm mb-4">{category.name}</p>
                    <button className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all">
                      देखें
                    </button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">क्यों चुनें MistriAdda?</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">सत्यापित प्रोफेशनल्स</h3>
                  <p className="text-gray-600">सभी मिस्त्री की पूरी जाँच और सत्यापन किया गया है</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">त्वरित सेवा</h3>
                  <p className="text-gray-600">24/7 उपलब्धता, जल्दी बुकिंग और तेज़ सर्विस</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">रेटिंग और रिव्यू</h3>
                  <p className="text-gray-600">असली कस्टमर रिव्यू के आधार पर सही मिस्त्री चुनें</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">पारदर्शी प्राइसिंग</h3>
                  <p className="text-gray-600">कोई छिपा हुआ चार्ज नहीं, सब कुछ पहले से स्पष्ट</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Services;
