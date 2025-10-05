#!/usr/bin/env node

/**
 * Simplified build script for Hostinger deployment
 * Builds React app and copies all necessary files to dist folder
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 Building MistriAdda for Hostinger...\n');

try {
    // Step 1: Clean previous build
    console.log('🧹 Step 1/5: Cleaning previous build...');
    if (fs.existsSync('dist')) {
        fs.rmSync('dist', { recursive: true, force: true });
    }
    console.log('✅ Cleaned\n');

    // Step 2: Build React app
    console.log('📦 Step 2/5: Building React app...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ React build complete\n');

    // Step 3: Copy PHP files
    console.log('📋 Step 3/5: Copying PHP files...');
    const phpFiles = [
        'index.php', 'config.php', 'save_profile.php', 'send_otp.php',
        'upload.php', 'upload_video.php', 'api.php', 'auth.php', 
        'firebase_otp.php', 'verify_otp.php', 'driver_register.php',
        'customer_register.php', 'schema.sql', 'debug.php', 
        'get_data.php', 'database.sql', '.htaccess'
    ];
    
    let copiedCount = 0;
    phpFiles.forEach(file => {
        if (fs.existsSync(file)) {
            fs.copyFileSync(file, `dist/${file}`);
            copiedCount++;
        }
    });
    console.log(`✅ Copied ${copiedCount} PHP files\n`);

    // Step 4: Create upload directories
    console.log('📁 Step 4/5: Creating upload directories...');
    const dirs = ['uploads', 'uploads/videos', 'uploads/profiles'];
    dirs.forEach(dir => {
        const distDir = `dist/${dir}`;
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
        }
    });
    console.log('✅ Directories created\n');

    // Step 5: Copy documentation
    console.log('📄 Step 5/5: Copying documentation...');
    const docs = [
        'FINAL-DEPLOYMENT-GUIDE.md',
        'HOSTINGER-COMPLETE-SETUP.md'
    ];
    
    docs.forEach(file => {
        if (fs.existsSync(file)) {
            fs.copyFileSync(file, `dist/${file}`);
        }
    });
    console.log('✅ Documentation copied\n');

    // Success message
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ BUILD SUCCESSFUL!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('📂 All files are in the "dist" folder');
    console.log('');
    console.log('🚀 NEXT STEPS:');
    console.log('   1. Upload all files from "dist" to Hostinger public_html');
    console.log('   2. Create MySQL database in Hostinger');
    console.log('   3. Import database.sql in phpMyAdmin');
    console.log('   4. Update config.php with database credentials');
    console.log('   5. Set uploads folder permissions to 755');
    console.log('');
    console.log('📖 Read FINAL-DEPLOYMENT-GUIDE.md for detailed steps');
    console.log('═══════════════════════════════════════════════════════');

} catch (error) {
    console.error('\n❌ BUILD FAILED:', error.message);
    console.error('\n🔧 TROUBLESHOOTING:');
    console.error('   1. Make sure Node.js is installed');
    console.error('   2. Run: npm install');
    console.error('   3. Try again: node build-simple.js');
    process.exit(1);
}
