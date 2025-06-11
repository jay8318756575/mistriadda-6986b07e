
export interface Mistri {
  id: string;
  name: string;
  category: string;
  location: string;
  mobile: string;
  experience: number;
  rating?: number;
  image?: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  nameHindi: string;
}
