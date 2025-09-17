# MistriAdda - Hostinger Deployment Guide

## स्टेप 1: प्रोजेक्ट बिल्ड करें

```bash
npm run build
```

## स्टेप 2: Hostinger पर अपलोड करें

1. **File Manager में जाएं** - Hostinger cPanel में File Manager खोलें
2. **public_html फोल्डर** में निम्नलिखित files अपलोड करें:

### जरूरी Files:
- `index.php` (मुख्य file)
- `.htaccess` (routing के लिए)
- `config.php` (database configuration)
- `save_profile.php` (प्रोफाइल save करने के लिए)
- `send_otp.php` (OTP भेजने के लिए)
- `upload_video.php` (video upload के लिए)
- `api.php` (API endpoints)
- `database.sql` (database schema)

### Assets:
- पूरा `assets/` फोल्डर (CSS और JS files)
- पूरा `src/assets/` फोल्डर (images)

### Directories बनाएं:
```
uploads/
├── videos/
└── profiles/
```

## स्टेप 3: Database Setup

1. **MySQL Database बनाएं**:
   - Hostinger cPanel में MySQL Databases जाएं
   - नया database बनाएं: `u123456789_mistriadda`
   - नया user बनाएं: `u123456789_mistri`
   - Strong password सेट करें

2. **Database Import करें**:
   - phpMyAdmin खोलें
   - `database.sql` file import करें

3. **config.php अपडेट करें**:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'u123456789_mistriadda'); // आपका database name
define('DB_USER', 'u123456789_mistri');     // आपका username
define('DB_PASS', 'YourPassword123!');      // आपका password
```

## स्टेप 4: Permissions Set करें

File Manager में:
- `uploads/` folder के लिए 755 permission
- `uploads/videos/` के लिए 755 permission  
- `uploads/profiles/` के लिए 755 permission

## स्टेप 5: Test करें

1. आपकी website खोलें: `https://yourdomain.com`
2. प्रोफाइल बनाने की कोशिश करें
3. Video upload test करें
4. OTP functionality check करें

## Features:

✅ **मिस्त्री प्रोफाइल बनाना**
✅ **वीडियो अपलोड**
✅ **OTP वेरिफिकेशन**
✅ **Category wise filtering**
✅ **Location based search**
✅ **Mobile responsive design**

## Troubleshooting:

### अगर white screen आती है:
1. `error_log` check करें
2. PHP version 7.4+ होना चाहिए
3. File permissions check करें

### Database connection issues:
1. Database credentials check करें
2. Database user permissions verify करें
3. `config.php` में details सही भरें

### File upload issues:
1. `uploads/` folder permissions (755)
2. PHP upload_max_filesize setting
3. max_execution_time setting

## API Endpoints:

- `POST /save_profile.php` - नई प्रोफाइल बनाना
- `POST /send_otp.php` - OTP भेजना
- `POST /upload_video.php` - वीडियो अपलोड
- `GET /api.php?endpoint=mistris` - मिस्त्री list
- `GET /api.php?endpoint=videos` - वीडियो list
- `GET /api.php?endpoint=categories` - categories

## Support:

किसी भी समस्या के लिए error logs check करें और database connection verify करें।