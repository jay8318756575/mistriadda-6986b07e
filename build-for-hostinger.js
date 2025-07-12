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
    execSync('npm run build', { stdio: 'inherit' });

    // Copy index.php to dist folder
    console.log('📋 Copying PHP files...');
    fs.copyFileSync('index.php', 'dist/index.php');

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
    const deploymentInfo = {
        buildDate: new Date().toISOString(),
        version: require('./package.json').version,
        platform: 'Hostinger',
        type: 'PHP + React SPA'
    };

    fs.writeFileSync('dist/deployment-info.json', JSON.stringify(deploymentInfo, null, 2));

    // Create upload instructions
    const instructions = `
🎉 BUILD SUCCESSFUL!

📁 DEPLOYMENT FILES READY IN 'dist' FOLDER

🚀 HOSTINGER DEPLOYMENT STEPS:

1. ZIP the 'dist' folder contents (not the folder itself)
2. Login to your Hostinger control panel
3. Go to File Manager
4. Navigate to public_html folder
5. Upload and extract the ZIP file
6. Make sure these files are in public_html root:
   ✓ index.php
   ✓ index.html
   ✓ .htaccess
   ✓ assets/ folder
   ✓ All other files

🔧 FEATURES INCLUDED:
✓ PHP backend for API calls
✓ React SPA with routing
✓ SEO optimized
✓ Mobile responsive
✓ Hindi/English support
✓ Supabase integration ready

🌐 AFTER UPLOAD:
- Your site will be available at your domain
- PHP API endpoints at: yoursite.com/?api=health
- All React routes will work properly

📞 SUPPORT: Check deployment-info.json for build details
`;

    fs.writeFileSync('dist/DEPLOYMENT-INSTRUCTIONS.txt', instructions);

    console.log('✅ Build completed successfully!');
    console.log('📂 Check the "dist" folder for deployment files');
    console.log('📖 Read DEPLOYMENT-INSTRUCTIONS.txt for upload steps');

} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}