#!/usr/bin/env node

/**
 * Build script for Hostinger deployment
 * This script builds the React app and prepares it for Hostinger hosting
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building MistriAdda for Hostinger deployment...');

try {
    // Clean previous build
    console.log('🧹 Cleaning previous build...');
    if (fs.existsSync('dist')) {
        fs.rmSync('dist', { recursive: true, force: true });
    }

    // Build the React app
    console.log('📦 Building React app...');
    try {
        execSync('npm run build', { stdio: 'inherit' });
    } catch (buildError) {
        console.error('❌ React build failed. Make sure all dependencies are installed.');
        throw buildError;
    }

    // Copy PHP files to dist
    console.log('📋 Copying PHP files...');
    const phpFiles = [
        'index.php', 'config.php', 'save_profile.php', 'send_otp.php', 
        'upload.php', 'upload_video.php', 'api.php', 'auth.php', 'firebase_otp.php',
        'verify_otp.php', 'driver_register.php', 'customer_register.php', 
        'schema.sql', 'debug.php', 'get_data.php', 'database.sql'
    ];
    
    phpFiles.forEach(phpFile => {
        if (fs.existsSync(phpFile)) {
            fs.copyFileSync(phpFile, `dist/${phpFile}`);
            console.log(`✅ Copied ${phpFile}`);
        }
    });

    // Copy .htaccess if it exists
    if (fs.existsSync('.htaccess')) {
        fs.copyFileSync('.htaccess', 'dist/.htaccess');
        console.log('✅ Copied .htaccess');
    }

    // Create uploads directory structure in dist
    const uploadDirs = ['uploads', 'uploads/videos', 'uploads/profiles'];
    uploadDirs.forEach(dir => {
        const distDir = `dist/${dir}`;
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
            console.log(`✅ Created ${dir} directory`);
        }
    });

    // Create .htaccess for proper routing
    console.log('⚙️ Creating .htaccess...');
    const htaccessContent = `# Hostinger deployment configuration
RewriteEngine On

# Handle React Router routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.php [L]

# Enable compression
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

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
`;

    fs.writeFileSync('dist/.htaccess', htaccessContent);

    // Create deployment info
    console.log('📄 Creating deployment info...');
    let packageVersion = '1.0.0';
    try {
        packageVersion = require('./package.json').version || '1.0.0';
    } catch (e) {
        console.log('⚠️  Could not read package.json version, using default');
    }
    const deploymentInfo = {
        buildDate: new Date().toISOString(),
        version: packageVersion,
        platform: 'Hostinger',
        type: 'Complete PHP + MySQL + React Website',
        features: [
            'Profile Creation',
            'Video Upload', 
            'OTP Verification',
            'Hindi/English Support',
            'Mobile Responsive',
            'SEO Optimized',
            '10+ SEO Pages',
            'Call Integration',
            'Direct Dialer Support'
        ],
        database: 'MySQL with sample data included',
        apis: [
            'save_profile.php',
            'upload_video.php', 
            'send_otp.php',
            'verify_otp.php',
            'get_data.php'
        ],
        pages: [
            'Home', 'About', 'Services', 'Contact',
            'Electrician Service', 'Plumber Service',
            'Carpenter Service', 'Painter Service',
            'FAQ', 'Blog'
        ]
    };

    fs.writeFileSync('dist/deployment-info.json', JSON.stringify(deploymentInfo, null, 2));

    // Copy comprehensive setup guide
    console.log('📋 Copying setup guides...');
    const setupFiles = [
        'HOSTINGER-COMPLETE-SETUP.md',
        'HOSTINGER-SETUP.md', 
        'README-HOSTINGER-DEPLOYMENT.md'
    ];
    
    setupFiles.forEach(file => {
        if (fs.existsSync(file)) {
            fs.copyFileSync(file, `dist/${file}`);
            console.log(`✅ Copied ${file}`);
        }
    });

    // Create upload instructions
    const instructions = `
🎉 MISTRIADDA WEBSITE - BUILD SUCCESSFUL!

📁 COMPLETE PACKAGE READY IN 'dist' FOLDER

🚀 QUICK HOSTINGER SETUP:

1. Create MySQL database in Hostinger panel
2. Upload all files to public_html folder  
3. Import database.sql in phpMyAdmin
4. Update config.php with database details
5. Set uploads/ folder permission to 755

📋 DETAILED SETUP GUIDE:
👉 Read HOSTINGER-COMPLETE-SETUP.md for complete instructions

🔧 COMPLETE FEATURES INCLUDED:
✅ Mistri profile creation & management
✅ Video upload with validation
✅ OTP verification system
✅ Search & category filtering
✅ Hindi/English language support
✅ Mobile responsive design
✅ 10+ SEO optimized pages with proper meta tags
✅ Direct call functionality (tel: integration)
✅ Complete MySQL database schema
✅ Sample data included
✅ Secure file uploads
✅ Error handling & debugging
✅ Navigation menu with all pages
✅ Structured data for Google

💾 DATABASE SCHEMA:
✅ Users, Mistris, Videos tables
✅ OTP verification system
✅ Categories with sample data
✅ Jobs & Reviews system
✅ Complete indexes for performance

🌐 AFTER UPLOAD YOUR WEBSITE WILL HAVE:
🔹 Professional home page
🔹 Category-wise mistri browsing
🔹 Video showcase feature
🔹 Profile creation forms
🔹 Mobile-friendly interface
🔹 Fast loading & SEO optimized

📞 SUPPORT: 
- Check debug.php for system health
- Read HOSTINGER-COMPLETE-SETUP.md for troubleshooting
- All files include error handling & fallbacks

🎯 READY FOR PRODUCTION USE!
`;

    fs.writeFileSync('dist/DEPLOYMENT-INSTRUCTIONS.txt', instructions);

    console.log('✅ Build completed successfully!');
    console.log('📂 Check the "dist" folder for deployment files');
    console.log('📖 Read DEPLOYMENT-INSTRUCTIONS.txt for upload steps');

} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}