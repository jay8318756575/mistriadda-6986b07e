# MistriAdda - Complete Hostinger Setup Guide

## 📋 Complete Package Contents

यह complete PHP + MySQL website package में निम्नलिखित सभी files शामिल हैं:

### Frontend Files
- `index.html` - Main HTML file with React app
- `assets/` - All CSS, JS, and image files
- Built React components with Hindi/English support

### PHP Backend Files
- `config.php` - Database configuration
- `save_profile.php` - Mistri profile creation
- `upload_video.php` - Video upload handler
- `send_otp.php` - OTP generation & verification
- `get_data.php` - Data retrieval API
- `api.php` - General API endpoints
- `auth.php` - Authentication functions
- `debug.php` - Debugging & health check

### Database Files
- `database.sql` - Complete database schema
- `schema.sql` - Alternative schema file

### Configuration Files
- `.htaccess` - Server configuration
- `uploads/` - Directory for file uploads

## 🚀 Step-by-Step Hostinger Setup

### Step 1: Database Setup
1. Login to your Hostinger control panel
2. Go to **Databases** → **MySQL Databases**
3. Create a new database (e.g., `u123456789_mistriadda`)
4. Create a database user with full permissions
5. Note down:
   - Database name
   - Username
   - Password
   - Host (usually `localhost`)

### Step 2: Import Database Schema
1. Go to **phpMyAdmin** in your Hostinger panel
2. Select your database
3. Click **Import** tab
4. Upload `database.sql` file
5. Click **Go** to import all tables

### Step 3: Upload Website Files
1. Go to **File Manager** in Hostinger
2. Navigate to `public_html` folder
3. Upload the complete package files
4. Extract if uploaded as ZIP
5. Ensure all files are in the root of `public_html`

### Step 4: Configure Database Connection
Edit `config.php` file and update these values:
```php
define('DB_HOST', 'localhost');           // Your database host
define('DB_NAME', 'u123456789_mistriadda'); // Your database name  
define('DB_USER', 'u123456789_mistri');     // Your database username
define('DB_PASS', 'YourStrongPassword123!'); // Your database password
```

### Step 5: Set Folder Permissions
Set the following permissions via File Manager:
- `uploads/` folder: 755
- `uploads/videos/` folder: 755  
- `uploads/profiles/` folder: 755
- All PHP files: 644

### Step 6: Test Your Website
Visit these URLs to test:
- `yourdomain.com` - Main website
- `yourdomain.com/debug.php` - Backend health check
- `yourdomain.com/get_data.php?type=categories` - API test

## ✅ Features Included

### Complete Functionality
- ✅ Mistri profile creation & management
- ✅ Video upload with file validation
- ✅ OTP generation & verification
- ✅ Category-wise browsing
- ✅ Search functionality
- ✅ Mobile responsive design
- ✅ Hindi/English language support
- ✅ SEO optimized pages

### Backend APIs
- ✅ Profile save API
- ✅ Video upload API
- ✅ OTP send/verify API
- ✅ Data retrieval API
- ✅ File upload validation
- ✅ Database & file storage fallback

### Security Features
- ✅ File type validation
- ✅ Size restrictions
- ✅ SQL injection protection
- ✅ XSS protection headers
- ✅ CORS configuration
- ✅ Error handling & logging

## 🔧 Database Schema

### Main Tables
- `users` - User authentication
- `mistris` - Mistri profiles & details
- `mistri_videos` - Video content
- `otp_verifications` - OTP management
- `categories` - Service categories
- `jobs` - Job bookings
- `reviews` - User reviews

### Sample Data
Database includes sample mistri profiles:
- राज शर्मा (Plumber)
- सुरेश कुमार (Electrician)  
- रमेश यादव (Carpenter)
- विकास गुप्ता (Painter)
- अनिल सिंह (Mechanic)

## 📱 User Workflow

### For Mistris (Workers)
1. Register phone number
2. Verify OTP
3. Create profile with category
4. Upload work videos
5. Receive job requests

### For Customers
1. Browse categories
2. Search mistris by location
3. View profiles & videos
4. Book services
5. Rate & review

## 🛠️ Troubleshooting

### Common Issues & Solutions

#### White Screen Problem
- Check `debug.php` for errors
- Verify database connection in `config.php`
- Ensure proper file permissions

#### Upload Issues
- Check `uploads/` folder exists with 755 permissions
- Verify PHP upload limits in hosting
- Check error logs in File Manager

#### Database Connection Failed
- Verify credentials in `config.php`
- Check database exists in phpMyAdmin
- Ensure user has proper permissions

#### API Not Working
- Check `.htaccess` file uploaded correctly
- Verify mod_rewrite enabled
- Test individual PHP files directly

### Debug URLs
- `/debug.php` - System health check
- `/get_data.php?type=categories` - Categories API
- `/get_data.php?type=mistris` - Mistris API

## 📞 Support & Maintenance

### Regular Maintenance
- Backup database weekly
- Monitor upload folder size
- Clear old OTP records
- Update database credentials if changed

### Performance Optimization
- Enable Gzip compression (included in .htaccess)
- Use CDN for static assets
- Optimize images before upload
- Monitor database queries

## 🔐 Security Best Practices

### Implemented Security
- Password hashing
- Prepared statements (SQL injection protection)
- File type validation
- XSS protection headers
- CSRF protection

### Additional Recommendations
- Use strong database passwords
- Regular backup strategy
- Monitor error logs
- Keep PHP version updated

---

## 🎉 Your Website Is Ready!

After following this guide, your MistriAdda website will be:
- ✅ Fully functional
- ✅ Mobile optimized  
- ✅ SEO friendly
- ✅ Secure & scalable
- ✅ Ready for production use

For any issues, check the debug.php file or contact support with error details.