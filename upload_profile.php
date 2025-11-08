<?php
require_once 'config.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSON(['success' => false, 'error' => 'Only POST method allowed'], 405);
}

try {
    $mistri_id = $_POST['mistri_id'] ?? '';
    $upload_type = $_POST['upload_type'] ?? 'profile'; // 'profile' or 'work'
    
    if (empty($mistri_id)) {
        sendJSON(['success' => false, 'error' => 'Mistri ID required'], 400);
    }
    
    // Check file upload
    $fileField = isset($_FILES['photo']) ? 'photo' : (isset($_FILES['file']) ? 'file' : null);
    
    if (!$fileField) {
        sendJSON(['success' => false, 'error' => 'No photo file provided'], 400);
    }
    
    $uploadedFile = $_FILES[$fileField];
    
    if ($uploadedFile['error'] !== UPLOAD_ERR_OK) {
        $upload_errors = [
            UPLOAD_ERR_INI_SIZE => 'File too large (server limit)',
            UPLOAD_ERR_FORM_SIZE => 'File too large (form limit)',
            UPLOAD_ERR_PARTIAL => 'File partially uploaded',
            UPLOAD_ERR_NO_FILE => 'No file uploaded',
            UPLOAD_ERR_NO_TMP_DIR => 'No temporary directory',
            UPLOAD_ERR_CANT_WRITE => 'Cannot write to disk',
            UPLOAD_ERR_EXTENSION => 'Upload stopped by extension'
        ];
        $error_msg = $upload_errors[$uploadedFile['error']] ?? 'Unknown upload error';
        sendJSON(['success' => false, 'error' => $error_msg], 400);
    }
    
    $file_size = $uploadedFile['size'];
    $file_type = $uploadedFile['type'];
    $file_name = $uploadedFile['name'];
    $file_extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    
    // Validate photo
    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    $max_size = 5 * 1024 * 1024; // 5MB
    
    if ($file_size > $max_size) {
        sendJSON(['success' => false, 'error' => 'Photo must be less than 5MB'], 400);
    }
    
    if (!in_array($file_type, $allowed_types) && !in_array($file_extension, $allowed_extensions)) {
        sendJSON(['success' => false, 'error' => 'Invalid photo format. Only JPG, PNG, GIF, WEBP allowed'], 400);
    }
    
    // Determine upload directory
    if ($upload_type === 'work') {
        $upload_dir = UPLOAD_DIR . 'work/';
    } else {
        $upload_dir = UPLOAD_DIR . 'profile/';
    }
    
    // Create directory if not exists
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }
    
    // Generate unique filename
    $unique_id = generateUUID();
    $new_filename = $upload_type . '_' . $mistri_id . '_' . $unique_id . '.' . $file_extension;
    $upload_path = $upload_dir . $new_filename;
    
    // Move uploaded file
    if (!move_uploaded_file($uploadedFile['tmp_name'], $upload_path)) {
        error_log('Failed to move uploaded file to ' . $upload_path);
        sendJSON(['success' => false, 'error' => 'Failed to save file. Check folder permissions.'], 500);
    }
    
    // Set proper permissions
    chmod($upload_path, 0644);
    
    // Prepare metadata
    $metadata = [
        'id' => $unique_id,
        'mistri_id' => $mistri_id,
        'type' => $upload_type,
        'filename' => $new_filename,
        'original_name' => $file_name,
        'file_size' => $file_size,
        'file_type' => $file_type,
        'upload_date' => date('Y-m-d H:i:s'),
        'url' => '/uploads/' . $upload_type . '/' . $new_filename
    ];
    
    // Save metadata to file
    $metadata_file = $upload_dir . 'metadata.txt';
    $metadata_line = json_encode($metadata) . "\n";
    file_put_contents($metadata_file, $metadata_line, FILE_APPEND);
    
    // If profile photo, update mistri record
    if ($upload_type === 'profile') {
        $pdo = getDBConnection();
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("UPDATE mistris SET profile_image = ? WHERE id = ?");
                $stmt->execute([$metadata['url'], $mistri_id]);
            } catch(PDOException $e) {
                // Continue even if update fails
                error_log('Failed to update mistri profile_image: ' . $e->getMessage());
            }
        }
        
        // Also update JSON file if exists
        $profile_file = PROFILE_DIR . $mistri_id . '.json';
        if (file_exists($profile_file)) {
            $profile_data = json_decode(file_get_contents($profile_file), true);
            $profile_data['profile_image'] = $metadata['url'];
            file_put_contents($profile_file, json_encode($profile_data, JSON_PRETTY_PRINT));
        }
    }
    
    sendJSON([
        'success' => true,
        'message' => ucfirst($upload_type) . ' photo uploaded successfully',
        'data' => $metadata
    ]);
    
} catch(Exception $e) {
    error_log('Upload error: ' . $e->getMessage());
    sendJSON(['success' => false, 'error' => 'Internal server error'], 500);
}
?>
