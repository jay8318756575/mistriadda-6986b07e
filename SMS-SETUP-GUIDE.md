# SMS OTP Setup Guide - मिस्त्रीअड्डा

## 🔥 Problem Fix: OTP SMS नहीं आ रहा था

**Solution**: अब MSG91 के साथ Real SMS integration कर दिया है।

## 📱 MSG91 Setup (FREE में 100 SMS)

### Step 1: MSG91 Account बनाएं
1. https://msg91.com पर जाएं
2. Sign Up करें (Mobile + Email से)
3. Free Credits मिलेंगे (100 SMS)

### Step 2: Template Create करें
1. Dashboard → SMS → Template
2. New Template बनाएं:
   ```
   Template Name: MistriAdda OTP
   Template Content: Your MistriAdda OTP is ##OTP##. Valid for 5 minutes.
   Template Type: Transactional
   ```
3. Submit करें और Approval wait करें (1-2 hours)

### Step 3: Details Copy करें
1. **Auth Key**: Dashboard → Account → API Key
2. **Template ID**: Templates section से मिलेगी
3. **Sender ID**: अपनी Sender ID choose करें (जैसे: MSTRAD)

### Step 4: `firebase_otp.php` में Update करें
```php
// Line 11-14 पर ये values update करें:
define('MSG91_AUTH_KEY', 'YOUR_ACTUAL_AUTH_KEY');      // Step 3 से
define('MSG91_TEMPLATE_ID', 'YOUR_ACTUAL_TEMPLATE_ID'); // Step 3 से  
define('MSG91_SENDER_ID', 'MSTRAD');                    // 6 chars max
define('USE_REAL_SMS', true);  // false से true करें
```

### Step 5: Test करें
1. Login page पर जाएं
2. Mobile number enter करें
3. अब **Real SMS आएगा** phone पर! 🎉

## 🔄 Alternative: अन्य SMS Services

### Twilio (Global, थोड़ा महंगा)
```php
// Twilio API के लिए code
$url = 'https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json';
// Implementation: https://www.twilio.com/docs/sms/api
```

### Fast2SMS (India, सस्ता)
```php
// Fast2SMS के लिए code
$url = 'https://www.fast2sms.com/dev/bulkV2';
// Implementation: https://docs.fast2sms.com/
```

### TextLocal (India)
```php
// TextLocal के लिए code  
$url = 'https://api.textlocal.in/send/';
// Implementation: https://api.textlocal.in/docs/
```

## 🧪 Demo Mode (बिना SMS Service के)

अगर अभी SMS service नहीं setup करना:
```php
define('USE_REAL_SMS', false);  // False रखें
```

Demo mode में:
- OTP screen पर ही दिखेगा
- कोई SMS नहीं जाएगा
- Testing के लिए बढ़िया है

## ❌ Common Errors & Solutions

### Error: "SMS भेजने में त्रुटि"
**Fix**: 
- Auth Key check करें
- Template approved है check करें
- Mobile number 10 digits का है check करें

### Error: "Invalid Auth Key"  
**Fix**: MSG91 dashboard से नया Auth Key copy करें

### Error: "Template not found"
**Fix**: Template ID सही है और approved है check करें

## 💰 Pricing (MSG91)

| Plan | SMS Count | Price |
|------|-----------|-------|
| Free Trial | 100 SMS | ₹0 |
| Starter | 10,000 SMS | ₹500 |
| Basic | 25,000 SMS | ₹1,000 |
| Pro | 1,00,000 SMS | ₹3,000 |

**Note**: Transactional SMS = ₹0.15-0.25 per SMS

## 📞 Support

MSG91 Issues: support@msg91.com
MistriAdda Issues: [Your email]

## ✅ Checklist

- [ ] MSG91 account बनाया
- [ ] Template approved हो गया
- [ ] Auth Key copy किया
- [ ] Template ID copy किया  
- [ ] `firebase_otp.php` में update किया
- [ ] `USE_REAL_SMS = true` किया
- [ ] Test किया - SMS आ गया! 🎉
