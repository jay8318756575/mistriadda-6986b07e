
import { Mistri } from '@/types/mistri';

// Sample profile images for demo
const sampleProfileImages = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=200&h=200&fit=crop&crop=face',
];

export const sampleMistris: Mistri[] = [
  {
    id: '1',
    name: 'राजेश कुमार',
    category: 'painter',
    location: 'Lucknow',
    mobile: '8123456789',
    experience: 5,
    rating: 4.5,
    description: 'घर की पेंटिंग का 5 साल का अनुभव, बेहतरीन काम की गारंटी',
    profile_photo_url: sampleProfileImages[0]
  },
  {
    id: '2',
    name: 'सुनीता वर्मा',
    category: 'painter',
    location: 'Kanpur',
    mobile: '9876543210',
    experience: 3,
    rating: 4.2,
    description: 'Wall painting और interior decoration विशेषज्ञ',
    profile_photo_url: sampleProfileImages[1]
  },
  {
    id: '3',
    name: 'अनिल शर्मा',
    category: 'painter',
    location: 'Agra',
    mobile: '7654321098',
    experience: 7,
    rating: 4.8,
    description: 'Professional house painting expert, सभी प्रकार की पेंटिंग',
    profile_photo_url: sampleProfileImages[2]
  },
  {
    id: '4',
    name: 'मोहन सिंह',
    category: 'electrician',
    location: 'Varanasi',
    mobile: '9123456789',
    experience: 8,
    rating: 4.6,
    description: 'घरेलू और commercial electrical work का विशेषज्ञ',
    profile_photo_url: sampleProfileImages[3]
  },
  {
    id: '5',
    name: 'रवि कुमार',
    category: 'plumber',
    location: 'Ghaziabad',
    mobile: '8234567891',
    experience: 4,
    rating: 4.3,
    description: 'पानी की टंकी और pipe fitting का काम, 24/7 उपलब्ध',
    profile_photo_url: sampleProfileImages[4]
  },
  {
    id: '6',
    name: 'सुरेश यादव',
    category: 'carpenter',
    location: 'Meerut',
    mobile: '7345678912',
    experience: 6,
    rating: 4.7,
    description: 'फर्निचर बनाने और repairing का काम, लकड़ी का विशेषज्ञ',
    profile_photo_url: sampleProfileImages[5]
  },
  {
    id: '7',
    name: 'प्रदीप गुप्ता',
    category: 'mason',
    location: 'Prayagraj',
    mobile: '9876543221',
    experience: 10,
    rating: 4.9,
    description: 'निर्माण कार्य और cement work का 10 साल का अनुभव',
    profile_photo_url: sampleProfileImages[6]
  },
  {
    id: '8',
    name: 'रामेश्वर प्रसाद',
    category: 'mechanic',
    location: 'Bareilly',
    mobile: '8765432109',
    experience: 12,
    rating: 4.5,
    description: 'गाड़ी की मरम्मत और maintenance, सभी प्रकार के वाहन',
    profile_photo_url: sampleProfileImages[7]
  }
];
