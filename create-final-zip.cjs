#!/usr/bin/env node

/**
 * Final ZIP creation for Hostinger deployment
 * Builds project and creates ready-to-upload package
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

console.log('🚀 Creating final MistriAdda package for Hostinger...\n');

try {
    // Step 1: Build the project
    console.log('📦 Step 1/4: Building React project...');
    execSync('node build-for-hostinger.js', { stdio: 'inherit' });
    console.log('✅ Build completed\n');

    // Step 2: Verify dist folder
    console.log('🔍 Step 2/4: Verifying dist folder...');
    if (!fs.existsSync('dist')) {
        throw new Error('dist folder not found. Build may have failed.');
    }
    
    const requiredFiles = [
        'index.php',
        'config.php',
        'upload_video.php',
        'database.sql',
        '.htaccess'
    ];
    
    let missingFiles = [];
    requiredFiles.forEach(file => {
        if (!fs.existsSync(`dist/${file}`)) {
            missingFiles.push(file);
        }
    });
    
    if (missingFiles.length > 0) {
        console.warn(`⚠️  Warning: Missing files: ${missingFiles.join(', ')}`);
    } else {
        console.log('✅ All required files present\n');
    }

    // Step 3: Create ZIP
    console.log('🗜️  Step 3/4: Creating ZIP archive...');
    
    const zipFileName = 'mistriadda-hostinger-final.zip';
    const output = fs.createWriteStream(zipFileName);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
    });

    let filesCount = 0;
    
    output.on('close', function() {
        const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
        console.log(`✅ ZIP created successfully!\n`);
        console.log('📊 PACKAGE DETAILS:');
        console.log(`   File: ${zipFileName}`);
        console.log(`   Size: ${sizeMB} MB`);
        console.log(`   Files: ${filesCount}`);
        console.log('');
        console.log('═══════════════════════════════════════════════════════');
        console.log('🎉 MISTRIADDA - READY FOR HOSTINGER DEPLOYMENT');
        console.log('═══════════════════════════════════════════════════════');
        console.log('');
        console.log('📁 PACKAGE FILE: ' + zipFileName);
        console.log('');
        console.log('🚀 UPLOAD INSTRUCTIONS:');
        console.log('');
        console.log('1️⃣  LOGIN TO HOSTINGER');
        console.log('   - Go to https://hostinger.com');
        console.log('   - Login to your account');
        console.log('   - Go to "Hosting" → "File Manager"');
        console.log('');
        console.log('2️⃣  UPLOAD ZIP FILE');
        console.log('   - Navigate to public_html folder');
        console.log('   - Upload: ' + zipFileName);
        console.log('   - Right-click → Extract');
        console.log('   - Delete the ZIP file after extraction');
        console.log('');
        console.log('3️⃣  DATABASE SETUP');
        console.log('   - Go to "Databases" → "Create MySQL Database"');
        console.log('   - Create database & user');
        console.log('   - Go to phpMyAdmin');
        console.log('   - Import: database.sql');
        console.log('');
        console.log('4️⃣  CONFIGURE DATABASE');
        console.log('   - Edit config.php in File Manager');
        console.log('   - Update DB_HOST, DB_NAME, DB_USER, DB_PASS');
        console.log('   - Save changes');
        console.log('');
        console.log('5️⃣  SET PERMISSIONS');
        console.log('   - uploads/ folder → 755');
        console.log('   - uploads/videos/ → 755');
        console.log('   - uploads/profiles/ → 755');
        console.log('');
        console.log('6️⃣  TEST YOUR WEBSITE');
        console.log('   - Visit: https://yourdomain.com');
        console.log('   - Test: https://yourdomain.com/debug.php');
        console.log('   - Test video upload');
        console.log('   - Test profile creation');
        console.log('');
        console.log('✨ FEATURES INCLUDED:');
        console.log('   ✅ 10+ SEO Optimized Pages');
        console.log('   ✅ Direct Call Integration');
        console.log('   ✅ Video Upload System');
        console.log('   ✅ Profile Management');
        console.log('   ✅ OTP Verification');
        console.log('   ✅ Hindi/English Support');
        console.log('   ✅ Mobile Responsive');
        console.log('   ✅ Google Indexing Ready');
        console.log('');
        console.log('📄 DOCUMENTATION:');
        console.log('   - HOSTINGER-COMPLETE-SETUP.md (detailed guide)');
        console.log('   - DEPLOYMENT-INSTRUCTIONS.txt (quick steps)');
        console.log('   - deployment-info.json (build details)');
        console.log('');
        console.log('⚡ QUICK TEST AFTER UPLOAD:');
        console.log('   curl https://yourdomain.com/debug.php');
        console.log('');
        console.log('═══════════════════════════════════════════════════════');
        console.log('🎯 YOUR WEBSITE IS READY TO GO LIVE!');
        console.log('═══════════════════════════════════════════════════════');
    });

    output.on('error', function(err) {
        throw err;
    });

    archive.on('error', function(err) {
        throw err;
    });

    // Count files
    archive.on('entry', function() {
        filesCount++;
    });

    archive.pipe(output);

    // Add all files from dist directory
    console.log('   Adding files from dist/...');
    archive.directory('dist/', false);

    // Add documentation files from root
    const docsToAdd = [
        'README.md',
        'HOSTINGER-COMPLETE-SETUP.md',
        'HOSTINGER-SETUP.md',
        'README-HOSTINGER-DEPLOYMENT.md',
        'README-DEPLOY.md'
    ];

    docsToAdd.forEach(file => {
        if (fs.existsSync(file)) {
            archive.file(file, { name: `docs/${file}` });
        }
    });

    // Finalize
    archive.finalize();

} catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('');
    console.error('🔧 TROUBLESHOOTING:');
    console.error('   1. Run: npm install');
    console.error('   2. Run: npm run build');
    console.error('   3. Try again: node create-final-zip.js');
    process.exit(1);
}
