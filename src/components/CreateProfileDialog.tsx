import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { categories } from '@/data/categories';
import { upCities } from '@/data/up-locations';
import { useToast } from '@/hooks/use-toast';
import { Camera, Video, Upload, Shield, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Mistri } from '@/types/mistri';
import { phpClient } from '@/integrations/supabase/client';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface CreateProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated: (profile: Mistri) => void;
}

const CreateProfileDialog = ({ isOpen, onClose, onProfileCreated }: CreateProfileDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    mobile: '',
    experience: '',
    description: '',
    aadharNumber: '',
    aadharAddress: ''
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [idProof, setIdProof] = useState<File | null>(null);
  const [workPhotos, setWorkPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // OTP verification states
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [otp, setOtp] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpId, setOtpId] = useState<string>('');
  
  const { toast } = useToast();

  const sendOTP = async () => {
    console.log('=== SEND OTP FUNCTION CALLED ===');
    
    if (!formData.mobile || formData.mobile.length !== 10) {
      console.log('Mobile number validation failed:', formData.mobile);
      toast({
        title: "त्रुटि",
        description: "कृपया 10 अंकों का सही मोबाइल नंबर भरें",
        variant: "destructive"
      });
      return;
    }

    setOtpSending(true);
    console.log('=== SENDING OTP ===');
    console.log('Mobile number:', formData.mobile);

    try {
      const result = await phpClient.sendOTP(formData.mobile, 'send');
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      console.log('OTP sent successfully:', result);
      setOtpId(result.otp); // For demo
      
      toast({
        title: "OTP भेजा गया ✅",
        description: `डेमो मोड में OTP: ${result.otp} (कोई भी 6 अंक का नंबर डालें)`,
      });

      setStep('otp');
      
    } catch (error) {
      console.error('=== OTP SENDING FAILED ===');
      console.error('Error details:', error);
      
      let errorMessage = "OTP भेजने में समस्या हुई। कृपया दोबारा कोशिश करें।";
      
      if (error instanceof Error) {
        errorMessage = `समस्या: ${error.message}`;
      }
      
      toast({
        title: "OTP त्रुटि ❌",
        description: errorMessage,
        variant: "destructive"
      });
      
    } finally {
      setOtpSending(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "त्रुटि",
        description: "कृपया 6 अंकों का OTP डालें",
        variant: "destructive"
      });
      return;
    }

    setOtpVerifying(true);
    console.log('=== VERIFYING OTP ===');
    console.log('OTP entered:', otp);
    console.log('OTP ID:', otpId);

    try {
      // Verify OTP using PHP API
      const result = await phpClient.sendOTP(formData.mobile, 'verify', otp);
      
      if (!result.success) {
        throw new Error(result.error || 'OTP verification failed');
      }
      console.log('OTP verified successfully');


      toast({
        title: "OTP सत्यापित",
        description: "आपका मोबाइल नंबर सफलतापूर्वक सत्यापित हो गया है!",
      });

      // Now create the profile
      await createProfile();
    } catch (error) {
      console.error('=== OTP VERIFICATION FAILED ===');
      console.error('Error details:', error);
      
      let errorMessage = "OTP सत्यापन में समस्या हुई। कृपया दोबारा कोशिश करें।";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "त्रुटि",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setOtpVerifying(false);
    }
  };

  const createProfile = async () => {
    console.log('=== CREATING PROFILE ===');
    
    try {
      // Prepare data for insertion
      const insertData = {
        name: formData.name.trim(),
        category: formData.category,
        location: formData.location,
        mobile: formData.mobile.trim(),
        experience: parseInt(formData.experience),
        rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
        description: formData.description.trim() || null,
        aadhar_number: formData.aadharNumber.trim(),
        aadhar_address: formData.aadharAddress.trim(),
        phone_verified: true, // Since OTP was verified
        verification_status: 'pending' as const,
        admin_approval_status: 'pending' as const
      };

      console.log('Data to be inserted:', insertData);

      // Save using PHP API
      const result = await phpClient.saveProfile(insertData);

      console.log('PHP API response:', result);

      if (!result.success) {
        console.error('Profile creation error:', result.error);
        throw new Error(`प्रोफाइल बनाने में समस्या: ${result.error}`);
      }

      if (result.data) {
        // Convert API response to Mistri type
        const newProfile: Mistri = {
          id: result.data.id,
          name: result.data.name,
          category: result.data.category,
          location: result.data.location,
          mobile: result.data.mobile,
          experience: result.data.experience,
          rating: result.data.rating,
          description: result.data.description
        };

        console.log('=== PROFILE CREATED SUCCESSFULLY ===');
        console.log('New profile:', newProfile);
        
        // Call the callback to add profile to the list
        onProfileCreated(newProfile);
        
        setStep('success');
        
        // Close dialog after showing success
        setTimeout(() => {
          onClose();
          resetForm();
        }, 3000);
      }
      
    } catch (error) {
      console.error('=== PROFILE CREATION FAILED ===');
      console.error('Error details:', error);
      
      let errorMessage = "प्रोफाइल बनाने में समस्या हुई। कृपया दोबारा कोशिश करें।";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "त्रुटि",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Form data:', formData);
    
    setIsSubmitting(true);
    
    // Basic validation
    const validationErrors: string[] = [];
    
    if (!formData.name?.trim()) {
      validationErrors.push("कृपया अपना नाम भरें");
    }
    
    if (!formData.category) {
      validationErrors.push("कृपया काम का प्रकार चुनें");
    }
    
    if (!formData.location) {
      validationErrors.push("कृपया अपना शहर चुनें");
    }
    
    if (!formData.mobile?.trim()) {
      validationErrors.push("कृपया मोबाइल नंबर भरें");
    } else if (formData.mobile.length !== 10 || !/^\d{10}$/.test(formData.mobile)) {
      validationErrors.push("कृपया 10 अंकों का सही मोबाइल नंबर भरें");
    }
    
    if (!formData.experience?.trim()) {
      validationErrors.push("कृपया अनुभव भरें");
    } else if (parseInt(formData.experience) < 0) {
      validationErrors.push("अनुभव 0 या अधिक होना चाहिए");
    }
    
    if (!formData.aadharNumber?.trim()) {
      validationErrors.push("कृपया आधार कार्ड नंबर भरें");
    } else if (!/^\d{12}$/.test(formData.aadharNumber)) {
      validationErrors.push("कृपया 12 अंकों का सही आधार कार्ड नंबर भरें");
    }
    
    if (!formData.aadharAddress?.trim()) {
      validationErrors.push("कृपया आधार कार्ड का पता भरें");
    }

    if (validationErrors.length > 0) {
      console.log('Validation errors:', validationErrors);
      toast({
        title: "त्रुटि",
        description: validationErrors.join(", "),
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    console.log('=== ALL VALIDATIONS PASSED ===');
    
    // Send OTP for verification
    try {
      await sendOTP();
    } catch (error) {
      console.error('Error in handleSubmit calling sendOTP:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      location: '',
      mobile: '',
      experience: '',
      description: '',
      aadharNumber: '',
      aadharAddress: ''
    });
    setPhoto(null);
    setVideo(null);
    setIdProof(null);
    setWorkPhotos([]);
    setStep('form');
    setOtp('');
    setOtpId('');
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating ${field} with value:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      toast({
        title: "फोटो चुनी गई",
        description: file.name,
      });
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "त्रुटि",
          description: "वीडियो का साइज़ 50MB से कम होना चाहिए",
          variant: "destructive"
        });
        return;
      }
      setVideo(file);
      toast({
        title: "वीडियो चुना गया",
        description: file.name,
      });
    }
  };

  const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdProof(file);
      toast({
        title: "पहचान प्रमाण चुना गया",
        description: file.name,
      });
    }
  };

  const handleWorkPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      toast({
        title: "त्रुटि",
        description: "अधिकतम 5 काम की फोटो अपलोड कर सकते हैं",
        variant: "destructive"
      });
      return;
    }
    setWorkPhotos(files);
    toast({
      title: "काम की फोटो चुनी गईं",
      description: `${files.length} फोटो चुनी गईं`,
    });
  };

  const renderFormStep = () => (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="name" className="text-orange-800 font-semibold">पूरा नाम *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="जैसे: राम कुमार"
          className="border-orange-300 focus:border-orange-500 bg-white shadow-sm"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <Label htmlFor="category" className="text-orange-800 font-semibold">काम का प्रकार *</Label>
        <Select 
          value={formData.category} 
          onValueChange={(value) => handleInputChange('category', value)}
          disabled={isSubmitting}
        >
          <SelectTrigger className="border-orange-300 focus:border-orange-500 bg-white shadow-sm">
            <SelectValue placeholder="अपना काम चुनें" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name} ({category.nameHindi})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="location" className="text-orange-800 font-semibold">शहर *</Label>
        <Select 
          value={formData.location} 
          onValueChange={(value) => handleInputChange('location', value)}
          disabled={isSubmitting}
        >
          <SelectTrigger className="border-orange-300 focus:border-orange-500 bg-white shadow-sm">
            <SelectValue placeholder="अपना शहर चुनें" />
          </SelectTrigger>
          <SelectContent className="bg-white max-h-48 overflow-y-auto">
            {upCities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="mobile" className="text-orange-800 font-semibold">मोबाइल नंबर *</Label>
        <Input
          id="mobile"
          type="tel"
          value={formData.mobile}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ''); // Only allow digits
            if (value.length <= 10) {
              handleInputChange('mobile', value);
            }
          }}
          placeholder="9876543210"
          className="border-orange-300 focus:border-orange-500 bg-white shadow-sm"
          maxLength={10}
          required
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500 mt-1">10 अंकों का नंबर (बिना +91 के)</p>
      </div>
      
      <div>
        <Label htmlFor="experience" className="text-orange-800 font-semibold">अनुभव (सालों में) *</Label>
        <Input
          id="experience"
          type="number"
          value={formData.experience}
          onChange={(e) => handleInputChange('experience', e.target.value)}
          placeholder="जैसे: 5"
          className="border-orange-300 focus:border-orange-500 bg-white shadow-sm"
          min="0"
          max="50"
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Profile Photo Upload */}
      <div>
        <Label htmlFor="photo" className="text-orange-800 font-semibold">प्रोफाइल फोटो</Label>
        <div className="mt-2">
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
            disabled={isSubmitting}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('photo')?.click()}
            className="w-full border-orange-300 hover:bg-orange-50 border-2 border-dashed"
            disabled={isSubmitting}
          >
            <Camera className="w-4 h-4 mr-2" />
            {photo ? photo.name : 'अपनी फोटो चुनें'}
          </Button>
        </div>
      </div>

      {/* ID Proof Upload */}
      <div>
        <Label htmlFor="idProof" className="text-orange-800 font-semibold">पहचान प्रमाण (आधार कार्ड/PAN)</Label>
        <div className="mt-2">
          <input
            id="idProof"
            type="file"
            accept="image/*,.pdf"
            onChange={handleIdProofChange}
            className="hidden"
            disabled={isSubmitting}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('idProof')?.click()}
            className="w-full border-orange-300 hover:bg-orange-50 border-2 border-dashed"
            disabled={isSubmitting}
          >
            <FileText className="w-4 h-4 mr-2" />
            {idProof ? idProof.name : 'पहचान प्रमाण अपलोड करें'}
          </Button>
        </div>
      </div>

      {/* Work Photos Upload */}
      <div>
        <Label htmlFor="workPhotos" className="text-orange-800 font-semibold">काम की फोटो (अधिकतम 5)</Label>
        <div className="mt-2">
          <input
            id="workPhotos"
            type="file"
            accept="image/*"
            multiple
            onChange={handleWorkPhotosChange}
            className="hidden"
            disabled={isSubmitting}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('workPhotos')?.click()}
            className="w-full border-orange-300 hover:bg-orange-50 border-2 border-dashed"
            disabled={isSubmitting}
          >
            <Camera className="w-4 h-4 mr-2" />
            {workPhotos.length > 0 ? `${workPhotos.length} फोटो चुनी गईं` : 'अपने काम की फोटो चुनें'}
          </Button>
        </div>
      </div>

      {/* Video Upload */}
      <div>
        <Label htmlFor="video" className="text-orange-800 font-semibold">काम का वीडियो (1 मिनट)</Label>
        <div className="mt-2">
          <input
            id="video"
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="hidden"
            disabled={isSubmitting}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('video')?.click()}
            className="w-full border-orange-300 hover:bg-orange-50 border-2 border-dashed"
            disabled={isSubmitting}
          >
            <Video className="w-4 h-4 mr-2" />
            {video ? video.name : 'अपना काम दिखाने वाला वीडियो चुनें'}
          </Button>
          <p className="text-xs text-gray-500 mt-1">अधिकतम 50MB, 1 मिनट का वीडियो</p>
        </div>
      </div>

      {/* Aadhar Number Field */}
      <div>
        <Label htmlFor="aadharNumber" className="text-orange-800 font-semibold">आधार कार्ड नंबर *</Label>
        <Input
          id="aadharNumber"
          type="text"
          value={formData.aadharNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ''); // Only allow digits
            if (value.length <= 12) {
              handleInputChange('aadharNumber', value);
            }
          }}
          placeholder="123456789012"
          className="border-orange-300 focus:border-orange-500 bg-white shadow-sm"
          maxLength={12}
          required
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500 mt-1">12 अंकों का आधार कार्ड नंबर</p>
      </div>

      {/* Aadhar Address Field */}
      <div>
        <Label htmlFor="aadharAddress" className="text-orange-800 font-semibold">आधार कार्ड का पूरा पता *</Label>
        <Textarea
          id="aadharAddress"
          value={formData.aadharAddress}
          onChange={(e) => handleInputChange('aadharAddress', e.target.value)}
          placeholder="आधार कार्ड में दिया गया पूरा पता भरें..."
          className="border-orange-300 focus:border-orange-500 bg-white shadow-sm"
          rows={3}
          required
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500 mt-1">आधार कार्ड में दिया गया वही पता भरें</p>
      </div>
      
      <div>
        <Label htmlFor="description" className="text-orange-800 font-semibold">काम का विवरण</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="अपने काम के बारे में बताएं..."
          className="border-orange-300 focus:border-orange-500 bg-white shadow-sm"
          rows={3}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="flex space-x-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
          disabled={isSubmitting}
        >
          रद्द करें
        </Button>
        <Button 
          type="submit"
          className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
          disabled={isSubmitting || otpSending}
        >
          <Shield className="w-4 h-4 mr-2" />
          {isSubmitting || otpSending ? 'OTP भेजा जा रहा है...' : 'OTP भेजें'}
        </Button>
      </div>
    </form>
  );

  const renderOTPStep = () => (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8 text-orange-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-orange-800 mb-2">OTP सत्यापन</h3>
          <p className="text-gray-600">
            आपके मोबाइल नंबर <span className="font-semibold">{formData.mobile}</span> पर भेजा गया 6 अंकों का OTP डालें
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <InputOTP value={otp} onChange={setOtp} maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="flex space-x-3">
        <Button 
          variant="outline" 
          onClick={() => {
            setStep('form');
            setOtp('');
          }}
          className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
          disabled={otpVerifying}
        >
          वापस जाएं
        </Button>
        <Button 
          onClick={verifyOTP}
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold"
          disabled={otpVerifying || otp.length !== 6}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {otpVerifying ? 'सत्यापित हो रहा है...' : 'OTP सत्यापित करें'}
        </Button>
      </div>

      <Button 
        variant="ghost"
        onClick={sendOTP}
        className="text-orange-600 hover:text-orange-700"
        disabled={otpSending}
      >
        {otpSending ? 'OTP भेजा जा रहा है...' : 'दोबारा OTP भेजें'}
      </Button>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center py-8">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">सफलता! 🎉</h3>
          <p className="text-gray-600 text-lg">
            <span className="font-semibold">{formData.name}</span> जी, आपकी प्रोफाइल सफलतापूर्वक बन गई है!
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-yellow-800">
          <AlertCircle className="w-5 h-5" />
          <p className="font-semibold">अगले चरण:</p>
        </div>
        <ul className="text-yellow-700 text-sm mt-2 space-y-1 text-left">
          <li>• आपकी प्रोफाइल एडमिन द्वारा सत्यापित की जाएगी</li>
          <li>• सत्यापन के बाद आपको काम मिलना शुरू हो जाएगा</li>
          <li>• आप अपनी प्रोफाइल खोज परिणामों में देख सकते हैं</li>
        </ul>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-orange-50 to-yellow-50">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-orange-800">
            {step === 'form' && 'मिस्त्री प्रोफाइल बनाएं'}
            {step === 'otp' && 'मोबाइल सत्यापन'}
            {step === 'success' && 'प्रोफाइल बन गई!'}
          </DialogTitle>
          {step === 'form' && (
            <p className="text-center text-gray-600">अपनी जानकारी भरें और काम पाना शुरू करें</p>
          )}
        </DialogHeader>
        
        {step === 'form' && renderFormStep()}
        {step === 'otp' && renderOTPStep()}
        {step === 'success' && renderSuccessStep()}
      </DialogContent>
    </Dialog>
  );
};

export default CreateProfileDialog;
