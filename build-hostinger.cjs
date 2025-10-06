#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building MistriAdda for Hostinger deployment...\n');
console.log('इससे website Hostinger पर upload के लिए तैयार होगी\n');

try {
    // Step 1: Clean previous builds
    console.log('1️⃣ Cleaning previous builds...');
    if (fs.existsSync('dist')) {
        fs.rmSync('dist', { recursive: true, force: true });
    }
    if (fs.existsSync('hostinger-build')) {
        fs.rmSync('hostinger-build', { recursive: true, force: true });
    }

    // Step 2: Build React app
    console.log('2️⃣ Building React application...');
    execSync('npm run build', { stdio: 'inherit' });

    // Step 3: Create Hostinger build directory
    console.log('3️⃣ Creating Hostinger deployment package...');
    fs.mkdirSync('hostinger-build', { recursive: true });

    // Step 4: Copy dist files
    console.log('4️⃣ Copying built assets...');
    copyDirectory('dist', 'hostinger-build');

    // Step 5: Copy PHP backend files
    console.log('5️⃣ Copying PHP backend files...');
    const phpFiles = [
        'config.php',
        'save_profile.php',
        'send_otp.php', 
        'upload_video.php',
        'verify_otp.php',
        'api.php',
        'auth.php',
        'customer_register.php',
        'driver_register.php',
        'get_data.php',
        'simple-website.php',
        'php-check.php',
        'check_php.php',
        'database.sql'
    ];

    let copiedCount = 0;
    phpFiles.forEach(file => {
        if (fs.existsSync(file)) {
            fs.copyFileSync(file, path.join('hostinger-build', file));
            console.log(`   ✅ Copied ${file}`);
            copiedCount++;
        } else {
            console.log(`   ⚠️  Missing ${file}`);
        }
    });
    console.log(`   📦 Total ${copiedCount} PHP files copied\n`);

    // Step 6: Copy main index.php (modified for React build)
    console.log('6️⃣ Creating optimized index.php...');
    createOptimizedIndexPHP();

    // Step 7: Create .htaccess
    console.log('7️⃣ Creating .htaccess...');
    createHtaccess();

    // Step 8: Create upload directories
    console.log('8️⃣ Creating upload directories...');
    fs.mkdirSync(path.join('hostinger-build', 'uploads'), { recursive: true });
    fs.mkdirSync(path.join('hostinger-build', 'uploads', 'videos'), { recursive: true });
    fs.mkdirSync(path.join('hostinger-build', 'uploads', 'profiles'), { recursive: true });

    // Step 9: Copy documentation
    console.log('9️⃣ Copying setup documentation...');
    if (fs.existsSync('HOSTINGER-FINAL-SETUP.md')) {
        fs.copyFileSync('HOSTINGER-FINAL-SETUP.md', path.join('hostinger-build', 'SETUP-GUIDE.md'));
    }

    console.log('\n✅ Build completed successfully! बिल्ड पूरा हुआ!');
    console.log('\n📦 Hostinger deployment package: hostinger-build/');
    console.log('\n🚀 अब Hostinger पर upload करने के लिए:');
    console.log('   1. hostinger-build/ folder खोलें');
    console.log('   2. सभी files select करें (folder को नहीं, अंदर की files को)');
    console.log('   3. Hostinger File Manager में public_html/ में upload करें');
    console.log('   4. config.php में database details भरें');
    console.log('   5. अपनी website खोलें और test करें');
    console.log('\n📚 Setup guide: HOSTINGER-QUICK-SETUP.md देखें');

} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}

function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    items.forEach(item => {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        
        if (fs.statSync(srcPath).isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

function createOptimizedIndexPHP() {
    const indexPHP = `<?php
// MistriAdda - Hostinger Deployment
// Serves React build and handles backend APIs

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Handle API requests
if (isset($_GET['api']) || strpos($_SERVER['REQUEST_URI'], '/api/') !== false) {
    require_once 'api.php';
    exit;
}

// Serve React build directly without modifications
if (file_exists('index.html')) {
    readfile('index.html');
} else {
    echo "Build files not found. Please run build command.";
}
?>`;

    fs.writeFileSync(path.join('hostinger-build', 'index.php'), indexPHP);
    console.log('   ✅ Created optimized index.php');
}

function createHtaccess() {
    const htaccess = `# MistriAdda Hostinger Configuration

RewriteEngine On

# Security Headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"

# API Routes
RewriteRule ^api/(.*)$ index.php?api=$1 [QSA,L]

# React Router Support
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^(.*)$ index.php [QSA,L]

# File Upload Security
<Files "*.php">
    Order Deny,Allow
    Allow from all
</Files>

# Prevent access to sensitive files
<Files "config.php">
    Order Deny,Allow
    Deny from all
    Allow from 127.0.0.1
</Files>

# GZIP Compression
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

# Browser Caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# File size limits for uploads
php_value upload_max_filesize 50M
php_value post_max_size 50M
php_value max_execution_time 300
php_value max_input_time 300`;

    fs.writeFileSync(path.join('hostinger-build', '.htaccess'), htaccess);
    console.log('   ✅ Created .htaccess with optimizations');
}