
import { useState } from 'react';
import Header from '@/components/Header';
import VideosList from '@/components/VideosList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Video, TrendingUp, Clock } from 'lucide-react';
import { categories } from '@/data/categories';

const Videos = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Video className="w-8 h-8 text-white" />
            <h1 className="text-4xl font-bold text-white">मिस्त्री वीडियो</h1>
          </div>
          <p className="text-xl text-orange-100">
            देखें कि आपके मिस्त्री कैसे काम करते हैं • वीडियो के माध्यम से उनकी कुशलता को समझें
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="वीडियो खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="श्रेणी चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी श्रेणियां</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.nameHindi}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="सॉर्ट करें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>नवीनतम</span>
                  </div>
                </SelectItem>
                <SelectItem value="popular">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>लोकप्रिय</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <VideosList 
            showMistriInfo={true}
            className="gap-6"
          />
        </div>
      </main>
    </div>
  );
};

export default Videos;
