
import React, { createContext, useContext, useState } from 'react';

export type SupportedLanguage = 'hi' | 'en' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'ml' | 'or' | 'pa' | 'ur';

export interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('hi');

  const setLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language);
  };

  // Initialize language from localStorage
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as SupportedLanguage;
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const t = (key: string) => {
    return translations[currentLanguage]?.[key] || translations['hi'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Translation object for all supported languages
const translations: Record<SupportedLanguage, Record<string, string>> = {
  hi: {
    'search.placeholder': 'मिस्त्री का नाम खोजें...',
    'search.category': 'काम की श्रेणी चुनें',
    'search.state': 'राज्य चुनें',
    'search.city': 'शहर चुनें',
    'search.button': 'खोजें',
    'search.header': 'अपना परफेक्ट मिस्त्री खोजें',
    'search.subtitle': 'बेहतरीन सेवा के लिए सबसे अच्छे मिस्त्री चुनें',
    'search.popular': 'पॉपुलर सर्च:',
    'search.allCategories': 'सभी श्रेणियां',
    'search.allStates': 'सभी राज्य',
    'search.allCities': 'सभी शहर',
    'mistri.count': 'मिस्त्री',
    'city.count': 'शहर',
    'category.count': 'श्रेणियां',
    'rating': 'रेटिंग'
  },
  en: {
    'search.placeholder': 'Search for mistri name...',
    'search.category': 'Select work category',
    'search.state': 'Select state',
    'search.city': 'Select city',
    'search.button': 'Search',
    'search.header': 'Find Your Perfect Mistri',
    'search.subtitle': 'Choose the best mistri for excellent service',
    'search.popular': 'Popular searches:',
    'search.allCategories': 'All Categories',
    'search.allStates': 'All States',
    'search.allCities': 'All Cities',
    'mistri.count': 'Mistris',
    'city.count': 'Cities',
    'category.count': 'Categories',
    'rating': 'Rating'
  },
  bn: {
    'search.placeholder': 'মিস্ত্রির নাম খুঁজুন...',
    'search.category': 'কাজের ধরন বেছে নিন',
    'search.state': 'রাজ্য বেছে নিন',
    'search.city': 'শহর বেছে নিন',
    'search.button': 'খুঁজুন',
    'search.header': 'আপনার পারফেক্ট মিস্ত্রি খুঁজুন',
    'search.subtitle': 'চমৎকার সেবার জন্য সেরা মিস্ত্রি বেছে নিন',
    'search.popular': 'জনপ্রিয় খোঁজ:',
    'search.allCategories': 'সব ধরনের কাজ',
    'search.allStates': 'সব রাজ্য',
    'search.allCities': 'সব শহর',
    'mistri.count': 'মিস্ত্রি',
    'city.count': 'শহর',
    'category.count': 'ধরন',
    'rating': 'রেটিং'
  },
  te: {
    'search.placeholder': 'మిస్త్రి పేరు వెతకండి...',
    'search.category': 'పని రకాన్ని ఎంచుకోండి',
    'search.state': 'రాష్ట్రాన్ని ఎంచుకోండి',
    'search.city': 'నగరాన్ని ఎంచుకోండి',
    'search.button': 'వెతకండి',
    'search.header': 'మీ పరిపూర్ణ మిస్త్రిని కనుగొనండి',
    'search.subtitle': 'అద్భుతమైన సేవ కోసం ఉత్తమ మిస్త్రిని ఎంచుకోండి',
    'search.popular': 'ప్రసిద్ధ శోధనలు:',
    'search.allCategories': 'అన్ని రకాలు',
    'search.allStates': 'అన్ని రాష్ట్రాలు',
    'search.allCities': 'అన్ని నగరాలు',
    'mistri.count': 'మిస్త్రి',
    'city.count': 'నగరాలు',
    'category.count': 'రకాలు',
    'rating': 'రేటింగ్'
  },
  mr: {
    'search.placeholder': 'मिस्त्रीचे नाव शोधा...',
    'search.category': 'कामाचा प्रकार निवडा',
    'search.state': 'राज्य निवडा',
    'search.city': 'शहर निवडा',
    'search.button': 'शोधा',
    'search.header': 'तुमचा परफेक्ट मिस्त्री शोधा',
    'search.subtitle': 'उत्कृष्ट सेवेसाठी सर्वोत्तम मिस्त्री निवडा',
    'search.popular': 'लोकप्रिय शोध:',
    'search.allCategories': 'सर्व प्रकार',
    'search.allStates': 'सर्व राज्य',
    'search.allCities': 'सर्व शहरे',
    'mistri.count': 'मिस्त्री',
    'city.count': 'शहरे',
    'category.count': 'प्रकार',
    'rating': 'रेटिंग'
  },
  ta: {
    'search.placeholder': 'மிஸ்திரி பெயரைத் தேடுங்கள்...',
    'search.category': 'வேலை வகையைத் தேர்ந்தெடுக்கவும்',
    'search.state': 'மாநிலத்தைத் தேர்ந்தெடுக்கவும்',
    'search.city': 'நகரத்தைத் தேர்ந்தெடுக்கவும்',
    'search.button': 'தேடுங்கள்',
    'search.header': 'உங்கள் சரியான மிஸ்திரியைக் கண்டறியுங்கள்',
    'search.subtitle': 'சிறந்த சேவைக்கு சிறந்த மிஸ்திரியைத் தேர்ந்தெடுக்கவும்',
    'search.popular': 'பிரபலமான தேடல்கள்:',
    'search.allCategories': 'அனைத்து வகைகளும்',
    'search.allStates': 'அனைத்து மாநிலங்களும்',
    'search.allCities': 'அனைத்து நகரங்களும்',
    'mistri.count': 'மிஸ்திரி',
    'city.count': 'நகரங்கள்',
    'category.count': 'வகைகள்',
    'rating': 'மதிப்பீடு'
  },
  gu: {
    'search.placeholder': 'મિસ્ત્રીનું નામ શોધો...',
    'search.category': 'કામનો પ્રકાર પસંદ કરો',
    'search.state': 'રાજ્ય પસંદ કરો',
    'search.city': 'શહેર પસંદ કરો',
    'search.button': 'શોધો',
    'search.header': 'તમારો પરફેક્ટ મિસ્ત્રી શોધો',
    'search.subtitle': 'ઉત્તમ સેવા માટે શ્રેષ્ઠ મિસ્ત્રી પસંદ કરો',
    'search.popular': 'લોકપ્રિય શોધ:',
    'search.allCategories': 'બધી શ્રેણીઓ',
    'search.allStates': 'બધા રાજ્યો',
    'search.allCities': 'બધા શહેરો',
    'mistri.count': 'મિસ્ત્રી',
    'city.count': 'શહેરો',
    'category.count': 'શ્રેણીઓ',
    'rating': 'રેટિંગ'
  },
  kn: {
    'search.placeholder': 'ಮಿಸ್ತ್ರಿ ಹೆಸರು ಹುಡುಕಿ...',
    'search.category': 'ಕೆಲಸದ ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    'search.state': 'ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    'search.city': 'ನಗರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    'search.button': 'ಹುಡುಕಿ',
    'search.header': 'ನಿಮ್ಮ ಪರಿಪೂರ್ಣ ಮಿಸ್ತ್ರಿಯನ್ನು ಹುಡುಕಿ',
    'search.subtitle': 'ಅತ್ಯುತ್ತಮ ಸೇವೆಗಾಗಿ ಅತ್ಯುತ್ತಮ ಮಿಸ್ತ್ರಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    'search.popular': 'ಜನಪ್ರಿಯ ಹುಡುಕಾಟಗಳು:',
    'search.allCategories': 'ಎಲ್ಲಾ ವರ್ಗಗಳು',
    'search.allStates': 'ಎಲ್ಲಾ ರಾಜ್ಯಗಳು',
    'search.allCities': 'ಎಲ್ಲಾ ನಗರಗಳು',
    'mistri.count': 'ಮಿಸ್ತ್ರಿ',
    'city.count': 'ನಗರಗಳು',
    'category.count': 'ವರ್ಗಗಳು',
    'rating': 'ರೇಟಿಂಗ್'
  },
  ml: {
    'search.placeholder': 'മിസ്ത്രിയുടെ പേര് തിരയുക...',
    'search.category': 'ജോലിയുടെ തരം തിരഞ്ഞെടുക്കുക',
    'search.state': 'സംസ്ഥാനം തിരഞ്ഞെടുക്കുക',
    'search.city': 'നഗരം തിരഞ്ഞെടുക്കുക',
    'search.button': 'തിരയുക',
    'search.header': 'നിങ്ങളുടെ പെർഫെക്റ്റ് മിസ്ത്രിയെ കണ്ടെത്തുക',
    'search.subtitle': 'മികച്ച സേവനത്തിനായി മികച്ച മിസ്ത്രിയെ തിരഞ്ഞെടുക്കുക',
    'search.popular': 'ജനപ്രിയ തിരയലുകൾ:',
    'search.allCategories': 'എല്ലാ വിഭാഗങ്ങളും',
    'search.allStates': 'എല്ലാ സംസ്ഥാനങ്ങളും',
    'search.allCities': 'എല്ലാ നഗരങ്ങളും',
    'mistri.count': 'മിസ്ത്രി',
    'city.count': 'നഗരങ്ങൾ',
    'category.count': 'വിഭാഗങ്ങൾ',
    'rating': 'റേറ്റിംഗ്'
  },
  or: {
    'search.placeholder': 'ମିସ୍ତ୍ରୀଙ୍କ ନାମ ଖୋଜନ୍ତୁ...',
    'search.category': 'କାମର ପ୍ରକାର ବାଛନ୍ତୁ',
    'search.state': 'ରାଜ୍ୟ ବାଛନ୍ତୁ',
    'search.city': 'ସହର ବାଛନ୍ତୁ',
    'search.button': 'ଖୋଜନ୍ତୁ',
    'search.header': 'ଆପଣଙ୍କ ପରଫେକ୍ଟ ମିସ୍ତ୍ରୀ ଖୋଜନ୍ତୁ',
    'search.subtitle': 'ଉତ୍କୃଷ୍ଟ ସେବା ପାଇଁ ସର୍ବୋତ୍ତମ ମିସ୍ତ୍ରୀ ବାଛନ୍ତୁ',
    'search.popular': 'ଲୋକପ୍ରିୟ ଖୋଜା:',
    'search.allCategories': 'ସମସ୍ତ ବର୍ଗ',
    'search.allStates': 'ସମସ୍ତ ରାଜ୍ୟ',
    'search.allCities': 'ସମସ୍ତ ସହର',
    'mistri.count': 'ମିସ୍ତ୍ରୀ',
    'city.count': 'ସହରସମୂହ',
    'category.count': 'ବର୍ଗସମୂହ',
    'rating': 'ରେଟିଂ'
  },
  pa: {
    'search.placeholder': 'ਮਿਸਤਰੀ ਦਾ ਨਾਮ ਖੋਜੋ...',
    'search.category': 'ਕੰਮ ਦੀ ਸ਼ਰੇਣੀ ਚੁਣੋ',
    'search.state': 'ਰਾਜ ਚੁਣੋ',
    'search.city': 'ਸ਼ਹਿਰ ਚੁਣੋ',
    'search.button': 'ਖੋਜੋ',
    'search.header': 'ਆਪਣਾ ਪਰਫੈਕਟ ਮਿਸਤਰੀ ਲੱਭੋ',
    'search.subtitle': 'ਸ਼ਾਨਦਾਰ ਸੇਵਾ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਮਿਸਤਰੀ ਚੁਣੋ',
    'search.popular': 'ਪ੍ਰਸਿੱਧ ਖੋਜਾਂ:',
    'search.allCategories': 'ਸਾਰੀਆਂ ਸ਼ਰੇਣੀਆਂ',
    'search.allStates': 'ਸਾਰੇ ਰਾਜ',
    'search.allCities': 'ਸਾਰੇ ਸ਼ਹਿਰ',
    'mistri.count': 'ਮਿਸਤਰੀ',
    'city.count': 'ਸ਼ਹਿਰ',
    'category.count': 'ਸ਼ਰੇਣੀਆਂ',
    'rating': 'ਰੇਟਿੰਗ'
  },
  ur: {
    'search.placeholder': 'مستری کا نام تلاش کریں...',
    'search.category': 'کام کی قسم منتخب کریں',
    'search.state': 'ریاست منتخب کریں',
    'search.city': 'شہر منتخب کریں',
    'search.button': 'تلاش کریں',
    'search.header': 'اپنا بہترین مستری تلاش کریں',
    'search.subtitle': 'بہترین خدمات کے لیے بہترین مستری کا انتخاب کریں',
    'search.popular': 'مقبول تلاش:',
    'search.allCategories': 'تمام اقسام',
    'search.allStates': 'تمام ریاستیں',
    'search.allCities': 'تمام شہر',
    'mistri.count': 'مستری',
    'city.count': 'شہر',
    'category.count': 'اقسام',
    'rating': 'ریٹنگ'
  }
};
