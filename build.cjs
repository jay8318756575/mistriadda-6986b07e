#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 MistriAdda Build for Hostinger Starting...\n');

try {
    // Step 0: Check and install dependencies if needed
    console.log('0️⃣ Checking dependencies...');
    if (!fs.existsSync('node_modules') || !fs.existsSync('node_modules/.bin/vite')) {
        console.log('   📦 Installing dependencies (यह कुछ समय ले सकता है)...');
        execSync('npm install', { stdio: 'inherit' });
        console.log('   ✅ Dependencies installed\n');
    } else {
        console.log('   ✅ Dependencies OK\n');
    }

    // Step 1: Clean dist folder
    console.log('1️⃣ Cleaning old build...');
    if (fs.existsSync('dist')) {
        fs.rmSync('dist', { recursive: true, force: true });
    }
    console.log('   ✅ Done\n');

    // Step 2: Build React
    console.log('2️⃣ Building React app...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('   ✅ React build complete\n');

    // Step 3: Copy PHP files
    console.log('3️⃣ Copying PHP files...');
    const phpFiles = [
        'config.php',
        'save_profile.php',
        'send_otp.php',
        'upload.php',
        'upload_video.php',
        'verify_otp.php',
        'api.php',
        'auth.php',
        'customer_register.php',
        'driver_register.php',
        'get_data.php',
        'firebase_otp.php',
        'database.sql',
        'schema.sql',
        '.htaccess'
    ];

    phpFiles.forEach(file => {
        if (fs.existsSync(file)) {
            fs.copyFileSync(file, path.join('dist', file));
            console.log(`   ✅ ${file}`);
        }
    });
    console.log('');

    // Step 4: Create proper index.php with PHP backend routing
    console.log('4️⃣ Creating index.php with PHP backend support...');
    const indexPHP = `<?php
/**
 * MistriAdda - Hostinger Deployment Entry Point
 * यह file React app और PHP backend को connect करती है
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

// Get the request URI
$request_uri = $_SERVER['REQUEST_URI'];
$script_name = $_SERVER['SCRIPT_NAME'];

// Remove query string
$request_path = strtok($request_uri, '?');

// Direct PHP file requests
if (preg_match('/\\.(php)$/', $request_path)) {
    // Let .htaccess handle PHP files
    return false;
}

// API endpoint routing - ये सभी PHP files को directly access करेगा
$api_routes = [
    'upload_video.php',
    'upload_photo.php', 
    'firebase_otp.php',
    'send_otp.php',
    'verify_otp.php',
    'save_profile.php',
    'api.php',
    'auth.php',
    'get_data.php',
    'customer_register.php',
    'driver_register.php'
];

// Check if request is for an API file
foreach ($api_routes as $api_file) {
    if (strpos($request_path, '/' . $api_file) !== false) {
        if (file_exists($api_file)) {
            require_once $api_file;
            exit;
        }
    }
}

// Static files (uploads, assets, etc.)
if (preg_match('/\\.(jpg|jpeg|png|gif|css|js|ico|svg|woff|woff2|ttf|mp4|webm)$/', $request_path)) {
    return false; // Let Apache serve static files
}

// Serve React app for all other routes (SPA routing)
if (file_exists('index.html')) {
    readfile('index.html');
    exit;
}

// Error fallback
http_response_code(404);
echo "Error: Application files not found. Please upload the dist/ folder contents properly.";
?>`;
    
    fs.writeFileSync(path.join('dist', 'index.php'), indexPHP);
    console.log('   ✅ index.php created with PHP backend routing\n');

    // Step 5: Create upload directories
    console.log('5️⃣ Creating upload directories...');
    const dirs = ['uploads', 'uploads/videos', 'uploads/profiles'];
    dirs.forEach(dir => {
        fs.mkdirSync(path.join('dist', dir), { recursive: true });
        console.log(`   ✅ ${dir}`);
    });
    console.log('');

    // Step 6: Create .htaccess if not exists
    console.log('6️⃣ Checking .htaccess...');
    const htaccessPath = path.join('dist', '.htaccess');
    if (!fs.existsSync(htaccessPath)) {
        const htaccess = `RewriteEngine On

# API Routes
RewriteRule ^api/(.*)$ index.php?api=$1 [QSA,L]

# React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^(.*)$ index.php [QSA,L]

# Upload Settings
php_value upload_max_filesize 50M
php_value post_max_size 50M
php_value max_execution_time 300`;
        fs.writeFileSync(htaccessPath, htaccess);
    }
    console.log('   ✅ .htaccess ready\n');

    // Success
    console.log('═══════════════════════════════════════════════');
    console.log('✅ BUILD SUCCESSFUL! बिल्ड पूरा हो गया!');
    console.log('═══════════════════════════════════════════════\n');
    console.log('📂 Files ready in: dist/\n');
    console.log('🚀 UPLOAD STEPS:');
    console.log('   1. dist/ folder की सभी files को Hostinger public_html में upload करें');
    console.log('   2. phpMyAdmin में database.sql import करें');
    console.log('   3. config.php में database details भरें');
    console.log('   4. uploads/ folder को 755 permission दें\n');
    console.log('✅ Profile, Video Upload, Call Button - सब काम करेगा!');
    console.log('═══════════════════════════════════════════════\n');

} catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n🔧 Solution: npm install चलाएं फिर try करें');
    process.exit(1);
}
