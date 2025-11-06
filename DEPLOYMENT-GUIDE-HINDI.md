# 🚀 Mistri Adda - Hostinger Deployment Guide

## जरूरी Files

### PHP Backend Files (सभी public_html/ में डालें):
- `config.php` - Database settings
- `api.php` - Data fetch करने के लिए
- `save_profile.php` - Profile save करने के लिए
- `send_otp.php` - OTP भेजने के लिए
- `verify_otp.php` - OTP verify करने के लिए
- `upload_video.php` - Video और Photo upload के लिए
- `database.sql` - Database tables

### React App Files (public_html/ में):
- `index.html`
- `assets/` folder (सारी JS/CSS files)

---

## Step 1: Database बनाएं

1. **cPanel → MySQL Databases**
2. New database बनाएं: `u123456789_mistriadda`
3. New user बनाएं: `u123456789_mistri`
4. Strong password चुनें
5. User को database से link करें
6. **phpMyAdmin** खोलें
7. अपना database select करें
8. **Import** tab → `database.sql` upload करें

---

## Step 2: config.php Update करें

```php
define('DB_HOST', 'localhost'); 
define('DB_NAME', 'u123456789_mistriadda');  // अपना actual name
define('DB_USER', 'u123456789_mistri');      // अपना actual user
define('DB_PASS', 'YourPassword123!');       // अपना actual password
```

---

## Step 3: Files Upload करें

**cPanel File Manager या FTP से:**

```
public_html/
├── config.php
├── api.php
├── save_profile.php
├── send_otp.php
├── verify_otp.php
├── upload_video.php
├── index.html
└── assets/
    ├── index-xxxxx.js
    └── index-xxxxx.css
```

---

## Step 4: Folder Permissions

File Manager में:
1. `public_html/` में right-click → New Folder → `uploads`
2. `uploads` folder पर right-click → Permissions → `755`
3. Sub-folders automatically बन जाएंगे पहले upload पर

---

## Step 5: Testing

### 1. API Test
Browser में खोलें:
```
https://yoursite.com/api.php?endpoint=categories
```
✅ Categories की list दिखनी चाहिए

### 2. Website Test
```
https://yoursite.com
```
✅ Home page load होना चाहिए

### 3. Profile Creation Test
- "मिस्त्री बनें" button click करें
- Form भरें
- OTP verify करें
- ✅ Profile बन जानी चाहिए

### 4. Photo Upload Test
- Profile बनाते समय photo select करें
- ✅ Photo upload और display होनी चाहिए

### 5. Video Upload Test
- किसी mistri के profile में video upload करें
- ✅ Success message आना चाहिए

---

## Common Problems

### "Database connection failed"
- `config.php` में credentials check करें
- Database user को database से properly link करें

### "Failed to save file"
- `uploads/` folder की permission `755` set करें
- cPanel में PHP settings check करें:
  - `upload_max_filesize = 500M`
  - `post_max_size = 500M`

### Photo/Video display नहीं हो रहे
- Browser console (F12) में errors check करें
- File permissions verify करें
- `uploads/photos/` और `uploads/videos/` exist करते हैं check करें

### OTP नहीं आ रहा
- Console में OTP print होगा (development mode)
- Production के लिए SMS API setup करें

---

## Final Checklist ✅

- [ ] Database बना लिया
- [ ] database.sql import कर दिया
- [ ] config.php update कर दिया
- [ ] सभी PHP files upload कर दीं
- [ ] index.html और assets/ upload कर दीं
- [ ] uploads/ folder बना लिया (755 permission)
- [ ] API test कर लिया
- [ ] Profile creation test कर लिया
- [ ] Photo upload test कर लिया
- [ ] Video upload test कर लिया

---

## File Structure (Final)

```
public_html/
├── PHP Backend Files
│   ├── config.php
│   ├── api.php
│   ├── save_profile.php
│   ├── send_otp.php
│   ├── verify_otp.php
│   └── upload_video.php
│
├── React App
│   ├── index.html
│   └── assets/
│
└── Uploads (Auto-created)
    └── uploads/
        ├── photos/
        ├── videos/
        └── profiles/
```

---

## 🎉 All Done!

अब आपकी website **100% ready** है:
- ✅ Profiles बन रहे हैं
- ✅ Photos upload हो रहे हैं
- ✅ Videos upload हो रहे हैं
- ✅ Mobile-friendly है
- ✅ Fast और Secure है

किसी भी problem के लिए browser console (F12) और cPanel error logs देखें!
