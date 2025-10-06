#!/usr/bin/env node

/**
 * Quick build script - Most reliable method
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 Quick Build Started...\n');

try {
    // Clean dist
    if (fs.existsSync('dist')) {
        fs.rmSync('dist', { recursive: true, force: true });
    }

    // Build React
    console.log('📦 Building React app...');
    execSync('npm run build', { stdio: 'inherit' });

    // Copy essential PHP files
    console.log('📋 Copying files...');
    const files = [
        'index.php', 'config.php', 'save_profile.php', 'send_otp.php',
        'upload.php', 'upload_video.php', 'verify_otp.php', 
        'database.sql', '.htaccess'
    ];
    
    files.forEach(file => {
        if (fs.existsSync(file)) {
            fs.copyFileSync(file, `dist/${file}`);
        }
    });

    // Create uploads folders
    ['uploads', 'uploads/videos', 'uploads/profiles'].forEach(dir => {
        fs.mkdirSync(`dist/${dir}`, { recursive: true });
    });

    console.log('\n✅ BUILD DONE! Files are in "dist" folder\n');

} catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Run: npm install');
    process.exit(1);
}
