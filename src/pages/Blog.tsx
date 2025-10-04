import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import { BookOpen, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Blog = () => {
  const blogPosts = [
    {
      title: 'घर की छोटी-मोटी मरम्मत: 10 जरूरी टिप्स',
      excerpt: 'जानें कैसे आप छोटी-मोटी समस्याओं को खुद ठीक कर सकते हैं और कब मिस्त्री को बुलाना जरूरी है।',
      date: '15 मार्च 2025',
      author: 'राजेश कुमार',
      category: 'गृह रखरखाव'
    },
    {
      title: 'सही प्लंबर कैसे चुनें? - पूरी गाइड',
      excerpt: 'प्लंबर चुनते समय किन बातों का ध्यान रखना चाहिए, रेट कैसे तय करें और गुणवत्ता कैसे सुनिश्चित करें।',
      date: '10 मार्च 2025',
      author: 'प्रिया शर्मा',
      category: 'प्लंबिंग'
    },
    {
      title: 'बिजली की समस्याएं और उनके समाधान',
      excerpt: 'घर में होने वाली आम बिजली की समस्याओं को पहचानें और समय पर इलेक्ट्रिशियन बुलाएं।',
      date: '5 मार्च 2025',
      author: 'अमित वर्मा',
      category: 'इलेक्ट्रिकल'
    },
    {
      title: 'फर्नीचर रखरखाव: लंबे समय तक नया जैसा रखें',
      excerpt: 'अपने लकड़ी के फर्नीचर की देखभाल कैसे करें ताकि वह सालों साल नया बना रहे।',
      date: '1 मार्च 2025',
      author: 'सुनीता देवी',
      category: 'फर्नीचर'
    },
    {
      title: 'घर की पेंटिंग: रंग चुनने की कला',
      excerpt: 'सही रंगों का चुनाव कैसे करें जो आपके घर को सुंदर और आरामदायक बनाए।',
      date: '25 फरवरी 2025',
      author: 'विकास सिंह',
      category: 'पेंटिंग'
    },
    {
      title: 'बारिश के मौसम में घर की देखभाल',
      excerpt: 'मानसून में घर में होने वाली आम समस्याएं और उनसे बचाव के तरीके।',
      date: '20 फरवरी 2025',
      author: 'नेहा गुप्ता',
      category: 'गृह रखरखाव'
    }
  ];

  return (
    <>
      <Helmet>
        <title>ब्लॉग और आर्टिकल - MistriAdda | होम मेंटेनेंस टिप्स और गाइड</title>
        <meta name="description" content="MistriAdda ब्लॉग पर पढ़ें घर की मरम्मत, रखरखाव और होम इम्प्रूवमेंट से जुड़े उपयोगी लेख। प्लंबिंग, इलेक्ट्रिकल, पेंटिंग और फर्नीचर की टिप्स।" />
        <meta name="keywords" content="home maintenance blog, DIY tips, प्लंबिंग टिप्स, इलेक्ट्रिकल गाइड, घर की देखभाल, home improvement articles" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-orange-100 p-6 rounded-full mb-6">
                <BookOpen className="w-16 h-16 text-orange-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                MistriAdda ब्लॉग
              </h1>
              <p className="text-lg text-gray-600">
                घर की देखभाल और रखरखाव से जुड़े उपयोगी टिप्स और गाइड
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post, index) => (
                <Card key={index} className="hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.date}
                      </div>
                    </div>
                    <CardTitle className="text-xl hover:text-orange-600 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-2" />
                      {post.author}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">लोकप्रिय टॉपिक्स</h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {['प्लंबिंग टिप्स', 'इलेक्ट्रिकल सेफ्टी', 'फर्नीचर केयर', 'पेंटिंग गाइड', 'होम रिपेयर', 'DIY प्रोजेक्ट्स', 'रखरखाव टिप्स', 'बजट होम इम्प्रूवमेंट'].map((topic) => (
                  <span key={topic} className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold hover:bg-orange-200 cursor-pointer transition-colors">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">नए आर्टिकल की सूचना पाएं</h2>
              <p className="mb-6">
                हमारे नए ब्लॉग पोस्ट्स और उपयोगी टिप्स सबसे पहले पाने के लिए सब्सक्राइब करें
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="अपना ईमेल दर्ज करें"
                  className="flex-1 px-4 py-3 rounded-full text-gray-800"
                />
                <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
                  सब्सक्राइब करें
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Blog;
