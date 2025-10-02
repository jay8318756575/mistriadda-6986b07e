# 🚀 MistriAdda - Hostinger पर Upload करने की पूरी Guide

## ⚡ तुरंत Upload करने के लिए (Step-by-Step)

### पहला कदम: Build करें

Terminal में यह command चलाएं:
```bash
node build-hostinger.js
```

यह command चलाने के बाद:
- ✅ React website build होगी
- ✅ PHP backend files copy होंगी  
- ✅ Upload folders बनेंगे
- ✅ सभी files `hostinger-build/` में तैयार होंगी

### दूसरा कदम: Hostinger पर Upload करें

**IMPORTANT**: `hostinger-build` folder को upload न करें, बल्कि उसके **अंदर की files** को upload करें

1. **File Manager खोलें**
   - Hostinger control panel में login करें
   - "File Manager" पर click करें
   - `public_html` folder खोलें

2. **पुरानी Files Delete करें** (पहली बार के लिए)
   - `public_html` में पहले से मौजूद सभी files delete करें
   - Empty folder रखें

3. **नई Files Upload करें**
   - अपने computer पर `hostinger-build` folder खोलें
   - **सभी files को select करें** (folder को नहीं, बल्कि अंदर की files को)
   - या सभी files का ZIP बनाएं और upload करके extract करें

4. **ये Files Upload होनी चाहिए:**
   - ✅ index.php
   - ✅ index.html
   - ✅ .htaccess
   - ✅ config.php
   - ✅ save_profile.php
   - ✅ upload_video.php
   - ✅ api.php
   - ✅ assets/ (folder)
   - ✅ uploads/ (folder)

### तीसरा कदम: Database Setup

1. **Database बनाएं**
   - Hostinger control panel में "Databases" section में जाएं
   - "Create New Database" पर click करें
   - Database name: जैसे `u123456_mistriadda`
   - Username बनाएं: जैसे `u123456_user`
   - Strong password set करें
   - "Create" पर click करें

2. **Database Tables बनाएं**
   - phpMyAdmin खोलें (Hostinger control panel में)
   - अपना database select करें
   - "Import" tab पर जाएं
   - `database.sql` file upload करें
   - "Go" पर click करें

3. **config.php में Database Details भरें**
   - File Manager में `public_html/config.php` खोलें
   - "Edit" पर click करें
   - ये details update करें:
   
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'u123456_mistriadda');  // आपका database name
   define('DB_USER', 'u123456_user');        // आपका username
   define('DB_PASS', 'YourPassword123!');    // आपका password
   ```
   
   - "Save" पर click करें

### चौथा कदम: Website Test करें

1. **Website खोलें**
   ```
   https://yourdomain.com
   ```

2. **Check करें:**
   - ✅ Website खुल रही है
   - ✅ Orange gradient background दिख रहा है
   - ✅ Categories दिख रही हैं
   - ✅ Buttons काम कर रहे हैं

3. **Backend Test करें:**
   - "मिस्त्री प्रोफाइल बनाएं" button पर click करें
   - Form भरें और submit करें
   - Profile save होनी चाहिए (database में)

4. **Video Upload Test करें:**
   - अपनी profile से video upload करें
   - Video database में save होनी चाहिए

## ⚠️ अगर Design Change हो रहा है

### Problem: Hostinger पर upload करने के बाद design अलग दिख रहा है

### Solution:
1. **Browser Cache Clear करें**
   - Ctrl + Shift + Delete (Windows)
   - Cmd + Shift + Delete (Mac)
   - सभी cache clear करें

2. **Hard Refresh करें**
   - Ctrl + F5 (Windows)
   - Cmd + Shift + R (Mac)

3. **Check करें files upload हुईं या नहीं:**
   - File Manager में check करें
   - `assets/` folder में files हैं या नहीं
   - `.htaccess` file upload हुई या नहीं

## ❌ Common Problems और Solutions

### Problem 1: Profile Save नहीं हो रहा

**Symptoms**: जब profile बनाते हैं तो error आ रही है या data save नहीं हो रहा

**Solution**:
```
1. Browser console खोलें (F12 press करें)
2. Network tab में देखें कि API call हो रही है या नहीं
3. अगर "Failed to fetch" दिख रहा है तो:
   - config.php में database details check करें
   - Database connection test करें
4. PHP error logs check करें Hostinger panel में
```

### Problem 2: Video Upload नहीं हो रहा

**Symptoms**: Video select करने के बाद upload नहीं हो रहा

**Solution**:
```
1. uploads/videos/ folder बना है या नहीं check करें
2. Folder permissions 755 होनी चाहिए
3. PHP upload_max_filesize check करें
4. .htaccess में video upload settings हैं या नहीं
```

### Problem 3: White Screen या Blank Page

**Symptoms**: Website खोलने पर सिर्फ white screen दिख रहा है

**Solution**:
```
1. Browser console (F12) में errors check करें
2. check_php.php खोलकर देखें: yourdomain.com/check_php.php
3. सभी files सही upload हुईं या नहीं verify करें
4. .htaccess file upload हुई है या नहीं check करें
```

### Problem 4: Database Connection Error

**Symptoms**: "Database connection failed" error दिख रहा है

**Solution**:
```
1. config.php में database details verify करें:
   - Database name सही है?
   - Username सही है?
   - Password सही है?
2. phpMyAdmin में database open करके check करें
3. Database user को सभी permissions दी हैं या नहीं
```

## 🎯 Website Features (Working)

✅ **Mistri Profile Creation**
- नया profile बना सकते हैं
- Photo upload कर सकते हैं
- Experience और details add कर सकते हैं
- Database में save होता है

✅ **Video Upload**  
- Multiple videos upload कर सकते हैं
- Title और description add कर सकते हैं
- Videos database में save होती हैं

✅ **Customer Registration**
- Customers register कर सकते हैं
- Login कर सकते हैं
- Mistris को contact कर सकते हैं

✅ **Search और Filter**
- Category से search कर सकते हैं
- Location से filter कर सकते हैं
- Mistris की list देख सकते हैं

✅ **Responsive Design**
- Mobile पर perfect काम करती है
- Tablet पर अच्छी दिखती है
- Desktop पर बढ़िया UI

## 📞 Help और Support

### अगर कुछ काम नहीं कर रहा तो:

1. **Error Logs Check करें**
   - Hostinger control panel → Error Logs
   - PHP errors देखें

2. **Browser Console Check करें**
   - F12 press करें
   - Console tab में errors देखें
   - Network tab में API calls check करें

3. **Check PHP Status**
   - `yourdomain.com/check_php.php` खोलें
   - PHP version और extensions check करें

4. **File Permissions Check करें**
   - uploads/ folder: 755
   - PHP files: 644
   - Folders: 755

## ✅ Final Checklist

Upload करने से पहले:
- [ ] `node build-hostinger.js` चलाया
- [ ] `hostinger-build/` folder बना
- [ ] सभी files upload हुईं
- [ ] config.php में database details भरीं
- [ ] Database tables create हुईं
- [ ] Website test की
- [ ] Profile create करके test किया
- [ ] Video upload test किया

---

**सब कुछ काम कर रहा है? तो बधाई हो! 🎉**

अब आपकी website live है और users profile बना सकते हैं, videos upload कर सकते हैं!