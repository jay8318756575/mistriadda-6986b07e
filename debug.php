<?php
/**
 * Debug script for MistriAdda deployment
 * This helps identify issues with Hostinger deployment
 */

header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MistriAdda Debug - डिबग जानकारी</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #f97316; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .section { margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .success { background: #d4edda; border-color: #c3e6cb; color: #155724; }
        .error { background: #f8d7da; border-color: #f5c6cb; color: #721c24; }
        .warning { background: #fff3cd; border-color: #ffeaa7; color: #856404; }
        .info { background: #d1ecf1; border-color: #bee5eb; color: #0c5460; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 3px; overflow-x: auto; }
        .status-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔧 MistriAdda Debug Information</h1>
            <p>वेबसाइट की स्थिति जांचने के लिए यह पेज बनाया गया है</p>
        </div>

        <div class="status-grid">
            <!-- PHP Status -->
            <div class="section <?php echo function_exists('phpinfo') ? 'success' : 'error'; ?>">
                <h3>🐘 PHP Status</h3>
                <p><strong>Version:</strong> <?php echo PHP_VERSION; ?></p>
                <p><strong>SAPI:</strong> <?php echo php_sapi_name(); ?></p>
                <p><strong>Memory Limit:</strong> <?php echo ini_get('memory_limit'); ?></p>
                <p><strong>Max Upload:</strong> <?php echo ini_get('upload_max_filesize'); ?></p>
            </div>

            <!-- File System -->
            <div class="section">
                <h3>📁 File System Check</h3>
                <?php
                $files_to_check = [
                    'index.php' => 'Main entry point',
                    'config.php' => 'Configuration file',
                    'assets/' => 'Assets directory',
                    '.htaccess' => 'Rewrite rules',
                    'uploads/' => 'Upload directory'
                ];
                
                foreach ($files_to_check as $file => $description) {
                    $exists = file_exists($file);
                    $class = $exists ? 'success' : 'error';
                    $status = $exists ? '✅' : '❌';
                    echo "<p class='{$class}'>{$status} {$file} - {$description}</p>";
                }
                ?>
            </div>

            <!-- Assets Check -->
            <div class="section">
                <h3>🎨 Assets Check</h3>
                <?php
                $assetsDir = __DIR__ . '/assets/';
                if (is_dir($assetsDir)) {
                    $cssFiles = glob($assetsDir . '*.css');
                    $jsFiles = glob($assetsDir . '*.js');
                    $manifestExists = file_exists(__DIR__ . '/.vite/manifest.json');
                    
                    echo "<p class='success'>✅ Assets directory exists</p>";
                    echo "<p>CSS Files: " . count($cssFiles) . "</p>";
                    echo "<p>JS Files: " . count($jsFiles) . "</p>";
                    echo "<p>Manifest: " . ($manifestExists ? '✅ Yes' : '❌ No') . "</p>";
                    
                    if ($manifestExists) {
                        $manifest = json_decode(file_get_contents(__DIR__ . '/.vite/manifest.json'), true);
                        echo "<pre>" . json_encode($manifest, JSON_PRETTY_PRINT) . "</pre>";
                    }
                } else {
                    echo "<p class='error'>❌ Assets directory not found</p>";
                }
                ?>
            </div>

            <!-- Database Connection -->
            <div class="section">
                <h3>🗄️ Database Status</h3>
                <?php
                if (file_exists('config.php')) {
                    include_once 'config.php';
                    try {
                        $pdo = getDBConnection();
                        if ($pdo) {
                            echo "<p class='success'>✅ Database connection successful</p>";
                            $stmt = $pdo->query("SHOW TABLES");
                            $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
                            echo "<p>Tables found: " . implode(', ', $tables) . "</p>";
                        } else {
                            echo "<p class='warning'>⚠️ Database connection failed - using file storage</p>";
                        }
                    } catch (Exception $e) {
                        echo "<p class='error'>❌ Database error: " . $e->getMessage() . "</p>";
                    }
                } else {
                    echo "<p class='error'>❌ config.php not found</p>";
                }
                ?>
            </div>

            <!-- Server Info -->
            <div class="section info">
                <h3>🖥️ Server Information</h3>
                <p><strong>Server:</strong> <?php echo $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'; ?></p>
                <p><strong>Document Root:</strong> <?php echo $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown'; ?></p>
                <p><strong>HTTP Host:</strong> <?php echo $_SERVER['HTTP_HOST'] ?? 'Unknown'; ?></p>
                <p><strong>Request URI:</strong> <?php echo $_SERVER['REQUEST_URI'] ?? 'Unknown'; ?></p>
                <p><strong>Script Name:</strong> <?php echo $_SERVER['SCRIPT_NAME'] ?? 'Unknown'; ?></p>
            </div>

            <!-- Permissions Check -->
            <div class="section">
                <h3>🔐 Permissions Check</h3>
                <?php
                $dirs_to_check = ['uploads/', 'uploads/videos/', 'uploads/profiles/'];
                foreach ($dirs_to_check as $dir) {
                    if (is_dir($dir)) {
                        $writable = is_writable($dir);
                        $class = $writable ? 'success' : 'error';
                        $status = $writable ? '✅ Writable' : '❌ Not writable';
                        echo "<p class='{$class}'>{$dir}: {$status}</p>";
                    } else {
                        echo "<p class='warning'>{$dir}: ⚠️ Directory not found</p>";
                    }
                }
                ?>
            </div>
        </div>

        <div class="section">
            <h3>🚀 Next Steps</h3>
            <ol>
                <li>यदि सभी checks ✅ हैं, तो main site <a href="index.php">यहाँ जाएं</a></li>
                <li>यदि Assets नहीं मिल रहे, तो build फिर से करें: <code>npm run build</code></li>
                <li>यदि Database connection fail हो रहा, तो config.php में database details check करें</li>
                <li>यदि अभी भी समस्या है, तो Hostinger support से संपर्क करें</li>
            </ol>
        </div>

        <div class="section info">
            <h3>📞 Support Information</h3>
            <p>यदि समस्या का समाधान नहीं हो रहा:</p>
            <ul>
                <li>इस page का screenshot लें</li>
                <li>Browser के Developer Tools में Console check करें</li>
                <li>Hostinger cPanel में Error Logs देखें</li>
            </ul>
        </div>
    </div>
</body>
</html>