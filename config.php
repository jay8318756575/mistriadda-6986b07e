<?php
// Database configuration for Hostinger
// Update these values with your Hostinger database details
// For Hostinger deployment - update these with your actual database details
define('DB_HOST', 'localhost'); 
define('DB_NAME', 'u123456789_mistriadda'); // Your actual Hostinger database name
define('DB_USER', 'u123456789_mistri');     // Your actual Hostinger database username  
define('DB_PASS', 'YourStrongPassword123!'); // Your actual database password

// For local development (uncomment these and comment above for local testing)
// define('DB_HOST', 'localhost');
// define('DB_NAME', 'mistriadda_local');
// define('DB_USER', 'root');
// define('DB_PASS', '');

// Alternative for local development
// define('DB_HOST', 'localhost');
// define('DB_NAME', 'mistriadda_local');
// define('DB_USER', 'root');
// define('DB_PASS', '');

// Upload directories
define('UPLOAD_DIR', 'uploads/');
define('VIDEO_DIR', UPLOAD_DIR . 'videos/');
define('PROFILE_DIR', UPLOAD_DIR . 'profiles/');

// Create upload directories if they don't exist
if (!file_exists(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}
if (!file_exists(VIDEO_DIR)) {
    mkdir(VIDEO_DIR, 0755, true);
}
if (!file_exists(PROFILE_DIR)) {
    mkdir(PROFILE_DIR, 0755, true);
}

// CORS headers for API requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Helper function to connect to database
function getDBConnection() {
    try {
        $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch(PDOException $e) {
        // Fallback to file-based storage if MySQL not available
        return null;
    }
}

// Helper function to generate UUID
function generateUUID() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

// Helper function to send JSON response
function sendJSON($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Database table creation (run once)
function createTables() {
    $pdo = getDBConnection();
    if (!$pdo) return false;
    
    try {
        // Create mistris table
        $pdo->exec("CREATE TABLE IF NOT EXISTS mistris (
            id VARCHAR(36) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            phone VARCHAR(20) NOT NULL UNIQUE,
            location VARCHAR(255) NOT NULL,
            category VARCHAR(100) NOT NULL,
            experience_years INT DEFAULT 0,
            description TEXT,
            profile_image VARCHAR(255),
            is_verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )");
        
        // Create videos table
        $pdo->exec("CREATE TABLE IF NOT EXISTS mistri_videos (
            id VARCHAR(36) PRIMARY KEY,
            mistri_id VARCHAR(36) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            video_url VARCHAR(500) NOT NULL,
            thumbnail_url VARCHAR(500),
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (mistri_id) REFERENCES mistris(id) ON DELETE CASCADE
        )");
        
        // Create OTP table
        $pdo->exec("CREATE TABLE IF NOT EXISTS otp_verifications (
            id VARCHAR(36) PRIMARY KEY,
            phone VARCHAR(20) NOT NULL,
            otp VARCHAR(6) NOT NULL,
            is_verified BOOLEAN DEFAULT FALSE,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");
        
        return true;
    } catch(PDOException $e) {
        return false;
    }
}

// Auto-create tables if using database
if (getDBConnection()) {
    createTables();
}
?>