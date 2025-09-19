# Hostinger Complete Setup Guide for MistriAdda

## चरण 1: Database Setup

### cPanel में Database बनाएं:
1. cPanel में "MySQL Databases" पर जाएं
2. नया database बनाएं: `u123456789_mistriadda`
3. नया user बनाएं: `u123456789_mistri`
4. Strong password सेट करें
5. User को database के साथ जोड़ें और सभी permissions दें

### SQL Tables Import करें:
```sql
CREATE TABLE IF NOT EXISTS mistris (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    experience_years INT DEFAULT 0,
    description TEXT,
    profile_image VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mistri_videos (
    id VARCHAR(36) PRIMARY KEY,
    mistri_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mistri_id) REFERENCES mistris(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS otp_verifications (
    id VARCHAR(36) PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## चरण 2: File Upload

### Method 1: Vite Build Upload (Recommended)
```bash
# Local machine पर build करें
npm run build

# निम्नलिखित files upload करें:
- dist/ (सभी files)
- index.php
- config.php
- save_profile.php
- send_otp.php
- upload_video.php
- verify_otp.php
- api.php
- get_data.php
- .htaccess
```

### Method 2: Pure PHP Upload (Fallback)
```bash
# केवल PHP files upload करें:
- simple-website.php (rename to index.php)
- config.php
- save_profile.php
- send_otp.php
- upload_video.php
- verify_otp.php
- api.php
- get_data.php
- .htaccess
```

## चरण 3: Configuration Files

### config.php में database details update करें:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'u123456789_mistriadda'); // आपका actual database name
define('DB_USER', 'u123456789_mistri');     // आपका actual username
define('DB_PASS', 'YourActualPassword');     // आपका actual password
```

### .htaccess file (Auto-created):
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache control
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

## चरण 4: Directory Structure
```
public_html/
├── index.php
├── config.php
├── save_profile.php
├── send_otp.php
├── upload_video.php
├── verify_otp.php
├── api.php
├── get_data.php
├── .htaccess
├── uploads/
│   ├── videos/
│   └── profiles/
└── assets/ (if using React build)
    ├── index-[hash].js
    ├── index-[hash].css
    └── ...
```

## चरण 5: Testing

### Test करने के लिए:
1. `https://yourdomain.com` खोलें
2. "मिस्त्री प्रोफाइल बनाएं" test करें
3. "कस्टमर रजिस्ट्रेशन" test करें
4. "वीडियो अपलोड" test करें

### Common Issues:

#### White Screen:
- PHP errors check करें: `error_log` में देखें
- File permissions check करें (755 for directories, 644 for files)
- Database connection test करें

#### Design Issues:
- CSS files properly load हो रहे हैं check करें
- Browser cache clear करें
- Mobile responsive test करें

#### Database Issues:
```sql
-- Test database connection:
SELECT 1;

-- Check tables:
SHOW TABLES;

-- Test mistri insert:
INSERT INTO mistris (id, name, phone, location, category) 
VALUES ('test-123', 'Test Name', '9999999999', 'Test Location', 'plumber');
```

## चरण 6: Security Setup

### File Permissions सेट करें:
```bash
# Directories: 755
chmod 755 uploads/
chmod 755 uploads/videos/
chmod 755 uploads/profiles/

# Files: 644
chmod 644 *.php
chmod 644 .htaccess
```

### Upload Security:
- File type validation already implemented
- File size limits in place
- XSS protection enabled

## चरण 7: Performance Optimization

### Enable Compression:
- Gzip compression already enabled in .htaccess
- Browser caching enabled

### Database Optimization:
```sql
-- Add indexes for better performance:
CREATE INDEX idx_mistris_category ON mistris(category);
CREATE INDEX idx_mistris_location ON mistris(location);
CREATE INDEX idx_mistris_phone ON mistris(phone);
```

## Support:
यदि कोई समस्या आए तो:
1. PHP error logs check करें
2. Browser developer tools में console errors देखें
3. Database connection test करें
4. File permissions verify करें

**बस यही steps follow करें और आपकी website perfectly काम करेगी!** 🚀