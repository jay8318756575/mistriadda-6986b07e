<?php
// Build script for creating a deployment package

echo "Building MistriAdda for deployment...\n";

// Create build directory
$buildDir = 'build';
if (!is_dir($buildDir)) {
    mkdir($buildDir, 0755, true);
}

// Copy essential PHP files
$phpFiles = [
    'config.php',
    'save_profile.php', 
    'send_otp.php',
    'upload_video.php',
    'verify_otp.php',
    'api.php',
    'get_data.php',
    'index.php',
    '.htaccess',
    'database.sql'
];

foreach ($phpFiles as $file) {
    if (file_exists($file)) {
        copy($file, $buildDir . '/' . $file);
        echo "Copied: $file\n";
    }
}

// Copy assets directory if it exists
if (is_dir('assets')) {
    copyDirectory('assets', $buildDir . '/assets');
    echo "Copied: assets directory\n";
}

// Copy dist directory if it exists (Vite build output)
if (is_dir('dist')) {
    copyDirectory('dist', $buildDir);
    echo "Copied: dist directory\n";
}

// Create upload directories
mkdir($buildDir . '/uploads', 0755, true);
mkdir($buildDir . '/uploads/videos', 0755, true);
mkdir($buildDir . '/uploads/profiles', 0755, true);

echo "Build completed! Upload the 'build' directory to your Hostinger hosting.\n";

function copyDirectory($src, $dst) {
    $dir = opendir($src);
    @mkdir($dst);
    while (false !== ($file = readdir($dir))) {
        if (($file != '.') && ($file != '..')) {
            if (is_dir($src . '/' . $file)) {
                copyDirectory($src . '/' . $file, $dst . '/' . $file);
            } else {
                copy($src . '/' . $file, $dst . '/' . $file);
            }
        }
    }
    closedir($dir);
}
?>