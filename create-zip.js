#!/usr/bin/env node

/**
 * Create ZIP file for Hostinger deployment
 * This script builds the project and creates a ready-to-upload ZIP file
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

console.log('🚀 Creating complete ZIP package for Hostinger...');

try {
    // First run the build script
    console.log('📦 Building project...');
    execSync('node build-for-hostinger.js', { stdio: 'inherit' });

    // Create ZIP file
    console.log('🗜️  Creating ZIP archive...');
    
    const output = fs.createWriteStream('mistriadda-hostinger.zip');
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level
    });

    output.on('close', function() {
        console.log('✅ ZIP file created successfully!');
        console.log(`📁 File size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
        console.log('📂 File: mistriadda-hostinger.zip');
        console.log('');
        console.log('🚀 UPLOAD INSTRUCTIONS:');
        console.log('1. Upload mistriadda-hostinger.zip to your Hostinger File Manager');
        console.log('2. Extract it in the public_html folder');
        console.log('3. Update database credentials in config.php');
        console.log('4. Import database.sql in your MySQL database');
        console.log('5. Set folder permissions: uploads/ (755)');
        console.log('');
        console.log('🌐 Your website will be ready!');
    });

    archive.on('error', function(err) {
        throw err;
    });

    archive.pipe(output);

    // Add all files from dist directory
    archive.directory('dist/', false);

    // Add additional files
    const additionalFiles = [
        'README.md',
        'HOSTINGER-SETUP.md',
        'README-HOSTINGER-DEPLOYMENT.md'
    ];

    additionalFiles.forEach(file => {
        if (fs.existsSync(file)) {
            archive.file(file, { name: file });
        }
    });

    // Finalize the archive
    archive.finalize();

} catch (error) {
    console.error('❌ ZIP creation failed:', error.message);
    process.exit(1);
}