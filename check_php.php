<?php
// Simple PHP check file to verify server configuration
header('Content-Type: application/json');

// Check if PHP is working
$php_version = phpversion();
$is_php_working = true;

// Check upload settings
$upload_max_filesize = ini_get('upload_max_filesize');
$post_max_size = ini_get('post_max_size');
$max_execution_time = ini_get('max_execution_time');

// Check if required extensions are loaded
$extensions = [
    'pdo' => extension_loaded('pdo'),
    'pdo_mysql' => extension_loaded('pdo_mysql'),
    'json' => extension_loaded('json'),
    'fileinfo' => extension_loaded('fileinfo')
];

// Check directory permissions
$upload_dir = 'uploads/';
$profiles_dir = 'uploads/profiles/';
$videos_dir = 'uploads/videos/';

$directories = [
    'uploads' => is_writable($upload_dir),
    'profiles' => is_writable($profiles_dir),
    'videos' => is_writable($videos_dir)
];

// Create directories if they don't exist
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}
if (!file_exists($profiles_dir)) {
    mkdir($profiles_dir, 0755, true);
}
if (!file_exists($videos_dir)) {
    mkdir($videos_dir, 0755, true);
}

$response = [
    'success' => true,
    'php_working' => $is_php_working,
    'php_version' => $php_version,
    'upload_settings' => [
        'upload_max_filesize' => $upload_max_filesize,
        'post_max_size' => $post_max_size,
        'max_execution_time' => $max_execution_time
    ],
    'extensions' => $extensions,
    'directories' => $directories,
    'timestamp' => date('Y-m-d H:i:s'),
    'message' => 'PHP is working correctly!'
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>