# Mistri Adda - Complete Hostinger Setup Guide

## 📁 Files to Upload to `public_html`

### PHP Backend Files
```
public_html/
├── config.php
├── save_profile.php
├── send_otp.php
├── verify_otp.php
├── upload.php
├── api.php
├── get_data.php
├── index.php
├── .htaccess
├── database.sql
└── uploads/              (will be created automatically)
    ├── videos/
    └── photos/
```

### React Build Files
After running `npm run build`, upload everything from `dist/` to `public_html/`:\
```
public_html/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
```

## 🗄️ Database Setup

### Step 1: Create Database in cPanel
1. Go to cPanel → MySQL Databases
2. Create new database: `mistriadda_db`
3. Create user: `mistriadda_user`
4. Set strong password
5. Add user to database with ALL PRIVILEGES

### Step 2: Import Schema
Upload and run `database.sql` through phpMyAdmin:
```sql
-- The database.sql file includes:
-- ✓ mistris table
-- ✓ mistri_videos table  
-- ✓ customers table
-- ✓ otp_verifications table
```

## ⚙️ Configuration

### Update `config.php`
```php
<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name');
define('DB_USER', 'your_database_user');
define('DB_PASS', 'your_database_password');

// Upload Directories - these will be created automatically
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('VIDEO_DIR', UPLOAD_DIR . 'videos/');
define('PROFILE_DIR', UPLOAD_DIR . 'profiles/');

// The rest remains the same
?>
```

## 📤 Upload Process

### Method 1: cPanel File Manager (Recommended)
1. Login to cPanel
2. File Manager → public_html
3. Upload all PHP files
4. Upload `dist/` contents (from React build)
5. Set permissions (see below)

### Method 2: FTP
1. Use FileZilla or similar
2. Connect to your Hostinger FTP
3. Navigate to `/public_html`
4. Upload all files
5. Set permissions

## 🔐 File Permissions

```bash
# Directories (755)
public_html/                 → 755
public_html/uploads/         → 755
public_html/uploads/videos/  → 755
public_html/uploads/photos/  → 755

# PHP Files (644)
*.php                        → 644

# .htaccess (644)
.htaccess                    → 644

# Uploaded files (644) - automatically set by upload.php
uploads/videos/*.mp4         → 644
uploads/photos/*.jpg         → 644
```

## 🧪 Testing

### 1. Test Upload Form
Visit: `https://yourdomain.com/upload-test.html`

This standalone test form allows you to:
- Upload videos with mistri ID and title
- Upload profile photos
- See real-time success/error messages
- Test the upload functionality independently

### 2. Test Main App
1. Visit: `https://yourdomain.com`
2. Click "प्रोफाइल बनाएं" (Create Profile)
3. Fill form and upload photo
4. Verify OTP (use any 6 digits in demo mode)
5. Check if profile is saved

### 3. Test API Endpoints

**Health Check:**
```bash
curl https://yourdomain.com/api.php?action=health_check
```

**Get Mistris:**
```bash
curl https://yourdomain.com/api.php?action=get_mistris
```

**Get Videos:**
```bash
curl https://yourdomain.com/api.php?action=get_videos
```

## 🐛 Common Issues & Solutions

### White Screen / Blank Page
- Check `.htaccess` is uploaded correctly
- Verify `index.html` exists in public_html
- Check browser console for errors
- Verify all assets loaded (F12 → Network tab)

### Upload Fails
- Check `uploads/` folder exists and has 755 permissions
- Verify PHP `upload_max_filesize` in php.ini (increase if needed)
- Check PHP error log in cPanel
- Test with `upload-test.html` first

### Database Connection Failed
- Verify credentials in `config.php`
- Test database connection in phpMyAdmin
- Check if user has proper privileges
- Ensure DB_HOST is 'localhost'

### 404 Errors
- Verify `.htaccess` exists and is correct
- Check mod_rewrite is enabled (usually enabled on Hostinger)
- Clear browser cache
- Check file paths are correct

## 🔒 Security Features (Built-in)

✅ File type validation (videos & photos only)
✅ File size limits (5MB photos, unlimited videos)
✅ Automatic folder permission setting
✅ XSS protection via JSON responses
✅ SQL injection protection (prepared statements)
✅ CORS headers configured
✅ Error logging without exposing details

## 📊 Viewing Uploaded Files

### Videos
Uploaded videos metadata is stored in:
- **Database:** `mistri_videos` table
- **File:** `uploads/videos/metadata.txt` (one JSON per line)

### Photos
Uploaded photos metadata is stored in:
- **File:** `uploads/photos/metadata.txt` (one JSON per line)

## 🚀 Build & Deploy Steps

```bash
# 1. Build React app
npm run build

# 2. The dist/ folder now contains:
#    - index.html
#    - assets/ (JS, CSS, images)

# 3. Upload to Hostinger:
#    a) All PHP files → public_html/
#    b) dist/index.html → public_html/index.html
#    c) dist/assets/ → public_html/assets/

# 4. Create folders (or they'll be auto-created):
mkdir public_html/uploads
mkdir public_html/uploads/videos
mkdir public_html/uploads/photos

# 5. Set permissions via cPanel File Manager

# 6. Import database.sql via phpMyAdmin

# 7. Update config.php with your DB credentials

# 8. Test using upload-test.html
```

## 📱 Mobile-Friendly Features

✅ Responsive upload form
✅ Touch-friendly buttons
✅ File input optimized for mobile
✅ Clear success/error messages
✅ Modern card-based design

## 🎨 Upload Form Features

- Clean, centered card design
- Gradient background
- Smooth animations
- Real-time file name display
- Loading indicator
- Success/error messages
- Mobile responsive
- Video AND photo upload support

## 📞 Support

If you encounter issues:
1. Check PHP error log in cPanel
2. Use browser console (F12) to check JavaScript errors
3. Test with `upload-test.html` to isolate issues
4. Verify all permissions are correct
5. Check database connection

---

**Made with ❤️ for Mistri Adda**
