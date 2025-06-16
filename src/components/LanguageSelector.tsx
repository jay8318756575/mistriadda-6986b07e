
import React from 'react';
import { useLanguage, SupportedLanguage } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { currentLanguage, setLanguage } = useLanguage();

  const languages: { code: SupportedLanguage; name: string; nativeName: string }[] = [
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  ];

  return (
    <div className="relative">
      <Globe className="absolute left-3 top-3 w-4 h-4 text-blue-600 z-10 pointer-events-none" />
      <Select value={currentLanguage} onValueChange={(value: SupportedLanguage) => setLanguage(value)}>
        <SelectTrigger className="pl-10 pr-4 py-2 text-sm border-2 border-blue-300 focus:border-blue-500 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 font-medium min-w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white/95 backdrop-blur-lg border-2 border-blue-200 shadow-2xl rounded-xl z-50 max-h-60">
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="font-medium py-2">
              {lang.nativeName} ({lang.name})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
