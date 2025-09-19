<?php
// PHP Environment Check for Hostinger
header('Content-Type: text/html; charset=UTF-8');

echo "<!DOCTYPE html>";
echo "<html lang='hi'>";
echo "<head>";
echo "<meta charset='UTF-8'>";
echo "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
echo "<title>PHP Environment Check</title>";
echo "<style>";
echo "body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); margin: 0; padding: 20px; color: white; }";
echo ".container { max-width: 800px; margin: 0 auto; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); }";
echo ".status { padding: 10px; margin: 10px 0; border-radius: 5px; }";
echo ".success { background: rgba(16, 185, 129, 0.8); }";
echo ".error { background: rgba(239, 68, 68, 0.8); }";
echo ".warning { background: rgba(245, 158, 11, 0.8); }";
echo "h1 { text-align: center; margin-bottom: 30px; }";
echo "</style>";
echo "</head>";
echo "<body>";

echo "<div class='container'>";
echo "<h1>🔧 MistriAdda - PHP Environment Check</h1>";

// PHP Version Check
echo "<div class='status " . (version_compare(PHP_VERSION, '7.4.0', '>=') ? 'success' : 'error') . "'>";
echo "<strong>PHP Version:</strong> " . PHP_VERSION;
echo version_compare(PHP_VERSION, '7.4.0', '>=') ? " ✅ (Compatible)" : " ❌ (Requires 7.4+)";
echo "</div>";

// Required Extensions
$required_extensions = ['pdo', 'pdo_mysql', 'json', 'fileinfo', 'gd'];
foreach ($required_extensions as $ext) {
    echo "<div class='status " . (extension_loaded($ext) ? 'success' : 'error') . "'>";
    echo "<strong>Extension $ext:</strong> " . (extension_loaded($ext) ? "✅ Loaded" : "❌ Missing");
    echo "</div>";
}

// File Upload Settings
echo "<div class='status success'>";
echo "<strong>File Upload:</strong> " . (ini_get('file_uploads') ? "✅ Enabled" : "❌ Disabled");
echo "<br><strong>Max Upload Size:</strong> " . ini_get('upload_max_filesize');
echo "<br><strong>Max Post Size:</strong> " . ini_get('post_max_size');
echo "</div>";

// Database Connection Test
require_once 'config.php';
try {
    $pdo = getDBConnection();
    if ($pdo) {
        echo "<div class='status success'>";
        echo "<strong>Database Connection:</strong> ✅ Connected Successfully";
        
        // Test tables creation
        $tables = createTables();
        echo "<br><strong>Database Tables:</strong> " . ($tables ? "✅ Created/Verified" : "⚠️ Issues");
        echo "</div>";
        
        // Test data operations
        try {
            $stmt = $pdo->query("SELECT COUNT(*) FROM mistris");
            $count = $stmt->fetchColumn();
            echo "<div class='status success'>";
            echo "<strong>Data Test:</strong> ✅ Tables accessible (Found $count mistris)";
            echo "</div>";
        } catch (Exception $e) {
            echo "<div class='status warning'>";
            echo "<strong>Data Test:</strong> ⚠️ " . $e->getMessage();
            echo "</div>";
        }
    } else {
        throw new Exception("Connection failed");
    }
} catch (Exception $e) {
    echo "<div class='status error'>";
    echo "<strong>Database Connection:</strong> ❌ Failed - " . $e->getMessage();
    echo "<br><em>Check config.php database credentials</em>";
    echo "</div>";
}

// Directory Permissions
$dirs = ['uploads', 'uploads/videos', 'uploads/profiles'];
foreach ($dirs as $dir) {
    $exists = is_dir($dir);
    $writable = $exists ? is_writable($dir) : false;
    
    echo "<div class='status " . ($exists && $writable ? 'success' : 'warning') . "'>";
    echo "<strong>Directory $dir:</strong> ";
    if (!$exists) {
        echo "⚠️ Not found (will be created)";
    } elseif (!$writable) {
        echo "❌ Not writable";
    } else {
        echo "✅ Ready";
    }
    echo "</div>";
}

// Server Information
echo "<div class='status success'>";
echo "<strong>Server Software:</strong> " . $_SERVER['SERVER_SOFTWARE'];
echo "<br><strong>Document Root:</strong> " . $_SERVER['DOCUMENT_ROOT'];
echo "<br><strong>Current Directory:</strong> " . getcwd();
echo "</div>";

// API Test
echo "<div class='status success'>";
echo "<strong>API Test:</strong> <a href='?api=health' style='color: white; text-decoration: underline;'>Test Health Endpoint</a>";
echo "</div>";

// Final Status
echo "<div style='text-align: center; margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 10px;'>";
echo "<h2>🎯 Setup Status</h2>";
echo "<p>यदि सभी checks ✅ हैं तो आपकी website ready है!</p>";
echo "<p><a href='index.php' style='color: white; font-weight: bold; text-decoration: underline;'>मुख्य website देखें →</a></p>";
echo "</div>";

echo "</div>";
echo "</body>";
echo "</html>";
?>