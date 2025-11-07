<?php
/**
 * Upload Configuration Test Script
 * इस file को browser में open करके देखें कि upload settings सही हैं या नहीं
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Test - MistriAdda</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .status-box {
            background: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .success {
            color: #10b981;
            font-weight: bold;
        }
        .error {
            color: #ef4444;
            font-weight: bold;
        }
        .warning {
            color: #f59e0b;
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #f97316;
            color: white;
        }
        .upload-form {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        input[type="file"] {
            margin: 10px 0;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 4px;
            width: 100%;
        }
        button {
            background: #f97316;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background: #ea580c;
        }
    </style>
</head>
<body>
    <h1>🔧 MistriAdda Upload Configuration Test</h1>
    
    <div class="status-box">
        <h2>PHP Upload Settings</h2>
        <table>
            <tr>
                <th>Setting</th>
                <th>Current Value</th>
                <th>Status</th>
            </tr>
            <tr>
                <td>File Uploads Enabled</td>
                <td><?php echo ini_get('file_uploads') ? 'Yes' : 'No'; ?></td>
                <td class="<?php echo ini_get('file_uploads') ? 'success' : 'error'; ?>">
                    <?php echo ini_get('file_uploads') ? '✓ OK' : '✗ ERROR'; ?>
                </td>
            </tr>
            <tr>
                <td>Max Upload Size</td>
                <td><?php echo ini_get('upload_max_filesize'); ?></td>
                <td class="<?php 
                    $size = ini_get('upload_max_filesize');
                    $size_mb = (int)$size;
                    echo $size_mb >= 100 ? 'success' : 'warning';
                ?>">
                    <?php echo $size_mb >= 100 ? '✓ Good' : '⚠ Low (need 100M+)'; ?>
                </td>
            </tr>
            <tr>
                <td>Max POST Size</td>
                <td><?php echo ini_get('post_max_size'); ?></td>
                <td class="<?php 
                    $post_size = ini_get('post_max_size');
                    $post_mb = (int)$post_size;
                    echo $post_mb >= 100 ? 'success' : 'warning';
                ?>">
                    <?php echo $post_mb >= 100 ? '✓ Good' : '⚠ Low (need 100M+)'; ?>
                </td>
            </tr>
            <tr>
                <td>Max Execution Time</td>
                <td><?php echo ini_get('max_execution_time'); ?> seconds</td>
                <td class="<?php 
                    $exec_time = ini_get('max_execution_time');
                    echo $exec_time >= 300 ? 'success' : 'warning';
                ?>">
                    <?php echo $exec_time >= 300 ? '✓ Good' : '⚠ Low (need 300+)'; ?>
                </td>
            </tr>
            <tr>
                <td>Memory Limit</td>
                <td><?php echo ini_get('memory_limit'); ?></td>
                <td class="success">✓ OK</td>
            </tr>
            <tr>
                <td>Upload Temp Directory</td>
                <td><?php 
                    $tmp = ini_get('upload_tmp_dir');
                    echo empty($tmp) ? sys_get_temp_dir() : $tmp;
                ?></td>
                <td class="<?php 
                    $tmp = empty($tmp) ? sys_get_temp_dir() : ini_get('upload_tmp_dir');
                    echo is_writable($tmp) ? 'success' : 'error';
                ?>">
                    <?php echo is_writable($tmp) ? '✓ Writable' : '✗ Not Writable'; ?>
                </td>
            </tr>
        </table>
    </div>

    <div class="status-box">
        <h2>Directory Permissions</h2>
        <table>
            <tr>
                <th>Directory</th>
                <th>Exists</th>
                <th>Writable</th>
            </tr>
            <?php
            $dirs = ['uploads', 'uploads/videos', 'uploads/profiles', 'uploads/photos'];
            foreach ($dirs as $dir) {
                $exists = file_exists($dir);
                $writable = $exists && is_writable($dir);
                echo "<tr>";
                echo "<td>$dir/</td>";
                echo "<td class='" . ($exists ? 'success' : 'error') . "'>" . ($exists ? '✓' : '✗') . "</td>";
                echo "<td class='" . ($writable ? 'success' : 'error') . "'>" . ($writable ? '✓' : '✗') . "</td>";
                echo "</tr>";
            }
            ?>
        </table>
    </div>

    <?php if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['test_file'])): ?>
    <div class="status-box">
        <h2>Upload Test Result</h2>
        <?php
        if ($_FILES['test_file']['error'] === UPLOAD_ERR_OK) {
            $filename = 'test_' . time() . '_' . $_FILES['test_file']['name'];
            $filepath = 'uploads/' . $filename;
            
            if (move_uploaded_file($_FILES['test_file']['tmp_name'], $filepath)) {
                echo '<p class="success">✓ File upload successful!</p>';
                echo '<p>File: ' . $filename . '</p>';
                echo '<p>Size: ' . number_format($_FILES['test_file']['size'] / 1024, 2) . ' KB</p>';
                
                // Clean up test file
                if (file_exists($filepath)) {
                    unlink($filepath);
                }
            } else {
                echo '<p class="error">✗ Failed to move uploaded file</p>';
            }
        } else {
            $errors = [
                UPLOAD_ERR_INI_SIZE => 'File too large (PHP limit)',
                UPLOAD_ERR_FORM_SIZE => 'File too large (form limit)',
                UPLOAD_ERR_PARTIAL => 'Partial upload',
                UPLOAD_ERR_NO_FILE => 'No file uploaded',
                UPLOAD_ERR_NO_TMP_DIR => 'No temp directory',
                UPLOAD_ERR_CANT_WRITE => 'Cannot write to disk',
                UPLOAD_ERR_EXTENSION => 'Upload stopped by extension'
            ];
            echo '<p class="error">✗ Upload error: ' . ($errors[$_FILES['test_file']['error']] ?? 'Unknown error') . '</p>';
        }
        ?>
    </div>
    <?php endif; ?>

    <div class="upload-form">
        <h2>Test File Upload</h2>
        <form method="POST" enctype="multipart/form-data">
            <label for="test_file">Choose a file to test upload:</label>
            <input type="file" name="test_file" id="test_file" required>
            <button type="submit">Test Upload</button>
        </form>
    </div>

    <div class="status-box">
        <h2>📋 Next Steps</h2>
        <ol>
            <li><strong>अगर सभी tests pass हो रहे हैं:</strong> Upload feature काम करेगा!</li>
            <li><strong>अगर कोई error है:</strong>
                <ul>
                    <li>Hostinger के cPanel से PHP settings check करें</li>
                    <li>uploads/ folder को 755 permission दें: <code>chmod 755 uploads -R</code></li>
                    <li>.htaccess file properly upload हुई है check करें</li>
                </ul>
            </li>
            <li><strong>Production में:</strong> यह test file delete कर दें (security के लिए)</li>
        </ol>
    </div>

</body>
</html>
