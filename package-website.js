#!/usr/bin/env node

/**
 * Final packaging script for complete MistriAdda website
 * Creates a production-ready package for Hostinger
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Creating Complete MistriAdda Website Package...');
console.log('=====================================');

try {
    // Step 1: Build the project
    console.log('📦 Step 1: Building React project...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Step 2: Run Hostinger build script
    console.log('🔧 Step 2: Preparing Hostinger package...');
    execSync('node build-for-hostinger.js', { stdio: 'inherit' });
    
    // Step 3: Verify all required files
    console.log('✅ Step 3: Verifying package contents...');
    
    const requiredFiles = [
        'dist/index.php',
        'dist/config.php', 
        'dist/save_profile.php',
        'dist/upload_video.php',
        'dist/send_otp.php',
        'dist/get_data.php',
        'dist/database.sql',
        'dist/.htaccess',
        'dist/assets'
    ];
    
    let allFilesExist = true;
    requiredFiles.forEach(file => {
        if (!fs.existsSync(file)) {
            console.error(`❌ Missing required file: ${file}`);
            allFilesExist = false;
        } else {
            console.log(`✅ Found: ${path.basename(file)}`);
        }
    });
    
    if (!allFilesExist) {
        throw new Error('Some required files are missing');
    }
    
    // Step 4: Create final package info
    console.log('📋 Step 4: Creating package information...');
    
    const packageInfo = {
        name: 'MistriAdda Complete Website',
        version: '1.0.0',
        description: 'Complete PHP + MySQL + React website for Hostinger',
        buildDate: new Date().toISOString(),
        platform: 'Hostinger Shared Hosting',
        technology: 'PHP 7.4+, MySQL 5.7+, React 18',
        features: {
            frontend: [
                'React SPA with routing',
                'Hindi/English language support', 
                'Mobile responsive design',
                'SEO optimized pages',
                'Video player integration',
                'Search & filtering'
            ],
            backend: [
                'PHP REST APIs',
                'MySQL database integration',
                'File upload handling',
                'OTP verification',
                'Error handling & logging',
                'Database & file storage fallback'
            ],
            database: [
                'Complete schema design',
                'Sample data included',
                'Proper indexing',
                'Foreign key relationships',
                'Security features'
            ]
        },
        fileStructure: {
            'index.php': 'Main entry point with React app loading',
            'config.php': 'Database configuration & helper functions',
            'save_profile.php': 'Mistri profile creation API',
            'upload_video.php': 'Video upload with validation',
            'send_otp.php': 'OTP generation & verification',
            'get_data.php': 'Data retrieval APIs',
            'database.sql': 'Complete MySQL schema with sample data',
            '.htaccess': 'Server configuration for SPA routing',
            'assets/': 'Compiled CSS, JS, and image files',
            'uploads/': 'Directory for user uploaded content'
        },
        deployment: {
            requirements: 'PHP 7.4+, MySQL 5.7+, Apache mod_rewrite',
            steps: 'See HOSTINGER-COMPLETE-SETUP.md for detailed instructions',
            testing: 'Visit debug.php after upload for health check'
        }
    };
    
    fs.writeFileSync('dist/PACKAGE-INFO.json', JSON.stringify(packageInfo, null, 2));
    
    console.log('');
    console.log('🎉 PACKAGE CREATION SUCCESSFUL!');
    console.log('=====================================');
    console.log('📂 Complete website ready in: dist/ folder');
    console.log('📋 Setup guide: HOSTINGER-COMPLETE-SETUP.md');
    console.log('🔍 Package details: PACKAGE-INFO.json');
    console.log('');
    console.log('🚀 READY FOR HOSTINGER UPLOAD!');
    console.log('💡 Tip: ZIP the dist/ folder contents for easy upload');
    
} catch (error) {
    console.error('❌ Package creation failed:', error.message);
    process.exit(1);
}