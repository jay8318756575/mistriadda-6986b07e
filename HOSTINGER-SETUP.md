# 🚀 Hostinger Deployment Instructions

## 📋 Complete PHP Backend Website

आपकी वेबसाइट अब पूरी तरह से PHP backend के साथ तैयार है। यह बिना Supabase के Hostinger पर चलेगी।

## 🛠️ Build करें

```bash
node build-for-hostinger.js
```

## 📁 Generated Files

**PHP Backend Files:**
- `config.php` - Database और configuration
- `save_profile.php` - मिस्त्री प्रोफाइल save करने के लिए
- `send_otp.php` - OTP भेजने और verify करने के लिए  
- `upload.php` - वीडियो upload करने के लिए
- `api.php` - General API endpoints
- `index.php` - Main entry point

**Frontend Files:**
- React app built files (HTML, CSS, JS)
- Static assets और images

## 🎯 Key Features

### ✅ PHP Backend APIs
- **Profile Creation**: `save_profile.php`
- **OTP System**: `send_otp.php`
- **Video Upload**: `upload.php` 
- **Data Retrieval**: `api.php`

### ✅ Storage Options
- **MySQL Database** (recommended)
- **File-based storage** (fallback)

### ✅ Frontend Features
- Hindi/English support
- Mobile responsive
- Profile creation with OTP
- Video upload system
- Category browsing

## 🔧 Hostinger Setup

### Step 1: Database Setup (Recommended)
1. Hostinger control panel → **MySQL Databases**
2. Create new database
3. Update `config.php` with your credentials:
   ```php
   define('DB_NAME', 'your_database_name');
   define('DB_USER', 'your_username');  
   define('DB_PASS', 'your_password');
   ```

### Step 2: Upload Files
1. Build करें: `node build-for-hostinger.js`
2. `dist` folder के सभी files को ZIP करें
3. Hostinger File Manager → `public_html`
4. ZIP upload करके extract करें

### Step 3: Permissions
```bash
chmod 755 uploads/
chmod 755 uploads/videos/
chmod 755 uploads/profiles/
```

## 🧪 Testing

**Test URLs:**
- `https://yoursite.com/` - Main website
- `https://yoursite.com/save_profile.php` - Profile API
- `https://yoursite.com/send_otp.php` - OTP API
- `https://yoursite.com/upload.php` - Upload API

## 🔄 User Workflow

1. **प्रोफाइल बनाना:**
   - Phone number enter करें
   - OTP receive करें
   - OTP verify करें  
   - Profile details भरें
   - Submit करें

2. **वीडियो Upload:**
   - Profile select करें
   - Video file choose करें
   - Title और description add करें
   - Upload करें

## 🛡️ Security Features

- File type validation
- File size limits (50MB)
- OTP expiration (5 minutes)
- Database prepared statements
- CORS headers configured

## 📞 Support

यदि कोई समस्या आए:
1. Browser console check करें
2. Hostinger error logs देखें
3. PHP error reporting enable करें
4. File permissions check करें

## 🎉 Production Ready!

यह complete solution है जो Hostinger पर बिना किसी external dependency के चलेगा।