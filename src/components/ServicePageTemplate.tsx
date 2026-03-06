import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Phone, Star, Clock, Shield, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import * as LucideIcons from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface ServiceStat {
  value: string;
  label: string;
}

interface ServicePageData {
  slug: string;
  titleHindi: string;
  titleEnglish: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  iconName: string;
  gradientFrom: string;
  gradientTo: string;
  bgFrom: string;
  bgTo: string;
  accentColor: string;
  accentBg: string;
  heroDescription: string;
  services: string[];
  premiumTitle: string;
  premiumDescription: string;
  premiumFeatures: string[];
  aboutTitle: string;
  aboutContent: string[];
  whyChooseUs: string[];
  processSteps: { title: string; description: string }[];
  stats: ServiceStat[];
  faqs: FAQ[];
  ctaText: string;
  relatedServices: { name: string; slug: string }[];
}

const ServicePageTemplate = ({ data }: { data: ServicePageData }) => {
  const IconComponent = (LucideIcons as any)[data.iconName] || LucideIcons.Wrench;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${data.titleHindi} - ${data.titleEnglish} Service`,
    "provider": {
      "@type": "Organization",
      "name": "MistriAdda",
      "url": "https://mistriadda.com"
    },
    "areaServed": "India",
    "description": data.metaDescription
  };

  return (
    <>
      <Helmet>
        <title>{data.metaTitle}</title>
        <meta name="description" content={data.metaDescription} />
        <meta name="keywords" content={data.metaKeywords} />
        <link rel="canonical" href={`https://mistriadda.com/${data.slug}`} />
        <meta property="og:title" content={data.metaTitle} />
        <meta property="og:description" content={data.metaDescription} />
        <meta property="og:url" content={`https://mistriadda.com/${data.slug}`} />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>

      <div className={`min-h-screen bg-gradient-to-br ${data.bgFrom} ${data.bgTo}`}>
        <Header />

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-12">
              <div className={`inline-block ${data.accentBg} p-6 rounded-full mb-6`}>
                <IconComponent className={`w-16 h-16 ${data.accentColor}`} />
              </div>
              <h1 className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r ${data.gradientFrom} ${data.gradientTo} bg-clip-text text-transparent`}>
                {data.titleHindi} ({data.titleEnglish}) सर्विस
              </h1>
              <p className="text-lg text-gray-600">{data.heroDescription}</p>
            </div>

            {/* Services List */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">हमारी {data.titleHindi} सेवाएं</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {data.services.map((service) => (
                  <div key={service} className={`flex items-center space-x-3 p-3 ${data.accentBg} rounded-lg`}>
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>

              {/* Premium Box */}
              <div className={`bg-gradient-to-r ${data.gradientFrom} ${data.gradientTo} rounded-xl p-6 text-white mb-8`}>
                <h3 className="text-2xl font-bold mb-4">{data.premiumTitle}</h3>
                <p className="mb-4">{data.premiumDescription}</p>
                <ul className="space-y-2">
                  {data.premiumFeatures.map((f, i) => (
                    <li key={i}>✓ {f}</li>
                  ))}
                </ul>
              </div>

              {/* About Section */}
              <div className="border-t pt-8 mb-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">{data.aboutTitle}</h2>
                {data.aboutContent.map((para, i) => (
                  <p key={i} className="text-gray-700 mb-4 leading-relaxed">{para}</p>
                ))}
              </div>

              {/* Why Choose Us */}
              <div className="border-t pt-8 mb-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">MistriAdda क्यों चुनें?</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {data.whyChooseUs.map((reason, i) => (
                    <div key={i} className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process Steps */}
              <div className="border-t pt-8 mb-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">कैसे काम करता है?</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {data.processSteps.map((step, i) => (
                    <div key={i} className={`text-center p-4 ${data.accentBg} rounded-lg`}>
                      <div className={`text-2xl font-bold ${data.accentColor} mb-2`}>Step {i + 1}</div>
                      <div className="font-semibold text-gray-800 mb-1">{step.title}</div>
                      <div className="text-sm text-gray-600">{step.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="border-t pt-8 mb-8">
                <div className="grid md:grid-cols-3 gap-4">
                  {data.stats.map((stat, i) => (
                    <div key={i} className={`text-center p-4 ${data.accentBg} rounded-lg`}>
                      <div className={`text-3xl font-bold ${data.accentColor} mb-2`}>{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="border-t pt-8 mb-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">अक्सर पूछे जाने वाले सवाल (FAQ)</h2>
                <Accordion type="single" collapsible className="w-full">
                  {data.faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left text-gray-800 font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Related Services - Internal Linking */}
              <div className="border-t pt-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">अन्य लोकप्रिय सेवाएं</h2>
                <div className="flex flex-wrap gap-3">
                  {data.relatedServices.map((s) => (
                    <Link key={s.slug} to={`/${s.slug}`} className={`px-4 py-2 ${data.accentBg} rounded-full text-sm font-medium ${data.accentColor} hover:opacity-80 transition`}>
                      {s.name} →
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link to="/">
                <Button className={`bg-gradient-to-r ${data.gradientFrom} ${data.gradientTo} text-white px-8 py-6 text-lg`}>
                  {data.ctaText}
                </Button>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ServicePageTemplate;
