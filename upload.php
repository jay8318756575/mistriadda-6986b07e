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
    // Determine upload type
    $uploadType = $_POST['type'] ?? 'video'; // 'video' or 'photo'
    
    // Check if file was uploaded
    $fileField = isset($_FILES['video']) ? 'video' : (isset($_FILES['photo']) ? 'photo' : (isset($_FILES['file']) ? 'file' : null));
    
    if (!$fileField) {
        sendJSON(['success' => false, 'error' => 'No file provided'], 400);
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
    
    // Validate based on type
    if ($uploadType === 'photo') {
        // Photo validation
        $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $max_size = 5 * 1024 * 1024; // 5MB
        
        if ($file_size > $max_size) {
            sendJSON(['success' => false, 'error' => 'Photo must be less than 5MB'], 400);
        }
        
        if (!in_array($file_type, $allowed_types) && !in_array($file_extension, $allowed_extensions)) {
            sendJSON(['success' => false, 'error' => 'Invalid photo format. Only JPG, PNG, GIF, WEBP allowed'], 400);
        }
        
        // Generate unique filename for photo
        $unique_id = generateUUID();
        $new_filename = 'photo_' . $unique_id . '.' . $file_extension;
        $upload_dir = UPLOAD_DIR . 'photos/';
        
        // Create photos directory if it doesn't exist
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }
        
        $upload_path = $upload_dir . $new_filename;
        
    } else {
        // Video validation
        $allowed_types = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
        $allowed_extensions = ['mp4', 'avi', 'mov', 'wmv', 'webm'];
        
        if (!in_array($file_type, $allowed_types) && !in_array($file_extension, $allowed_extensions)) {
            sendJSON(['success' => false, 'error' => 'Invalid video format. Only MP4, AVI, MOV, WMV, WEBM allowed'], 400);
        }
        
        // Get form data for video
        $mistri_id = isset($_POST['mistri_id']) ? trim($_POST['mistri_id']) : '';
        $title = isset($_POST['title']) ? trim($_POST['title']) : '';
        $description = isset($_POST['description']) ? trim($_POST['description']) : '';
        
        if (empty($mistri_id) || empty($title)) {
            sendJSON(['success' => false, 'error' => 'Mistri ID and title are required'], 400);
        }
        
        // Check if mistri exists
        $mistri_exists = false;
        $pdo = getDBConnection();
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("SELECT id FROM mistris WHERE id = ?");
                $stmt->execute([$mistri_id]);
                $mistri_exists = $stmt->fetch() !== false;
            } catch(PDOException $e) {
                // Continue with file check
            }
        }
        
        if (!$mistri_exists) {
            $profile_file = PROFILE_DIR . $mistri_id . '.json';
            $mistri_exists = file_exists($profile_file);
        }
        
        if (!$mistri_exists) {
            sendJSON(['success' => false, 'error' => 'Mistri profile not found'], 404);
        }
        
        // Generate unique filename for video
        $video_id = generateUUID();
        $new_filename = 'video_' . $video_id . '.' . $file_extension;
        $upload_path = VIDEO_DIR . $new_filename;
    }
    
    // Move uploaded file
    if (!move_uploaded_file($uploadedFile['tmp_name'], $upload_path)) {
        error_log('Failed to move uploaded file to ' . $upload_path);
        sendJSON(['success' => false, 'error' => 'Failed to save file. Check folder permissions.'], 500);
    }
    
    // Set proper permissions
    chmod($upload_path, 0644);
    
    // Save metadata
    if ($uploadType === 'photo') {
        $metadata = [
            'id' => $unique_id,
            'filename' => $new_filename,
            'original_name' => $file_name,
            'file_size' => $file_size,
            'file_type' => $file_type,
            'upload_date' => date('Y-m-d H:i:s'),
            'url' => '/uploads/photos/' . $new_filename
        ];
        
        // Save to metadata file
        $metadata_file = $upload_dir . 'metadata.txt';
        $metadata_line = json_encode($metadata) . "\n";
        file_put_contents($metadata_file, $metadata_line, FILE_APPEND);
        
        sendJSON([
            'success' => true,
            'message' => 'Photo uploaded successfully',
            'data' => $metadata
        ]);
        
    } else {
        // Video metadata
        $video_data = [
            'id' => $video_id,
            'mistri_id' => $mistri_id,
            'title' => $title,
            'description' => $description,
            'video_url' => '/uploads/videos/' . $new_filename,
            'filename' => $new_filename,
            'file_size' => $file_size,
            'is_active' => true,
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        // Try database first
        $pdo = getDBConnection();
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("INSERT INTO mistri_videos (id, mistri_id, title, description, video_url, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $video_data['id'],
                    $video_data['mistri_id'],
                    $video_data['title'],
                    $video_data['description'],
                    $video_data['video_url'],
                    $video_data['is_active'],
                    $video_data['created_at']
                ]);
            } catch(PDOException $e) {
                if (file_exists($upload_path)) {
                    unlink($upload_path);
                }
                error_log('Database error: ' . $e->getMessage());
                sendJSON(['success' => false, 'error' => 'Database error'], 500);
            }
        } else {
            // Fallback to file storage
            $video_record_file = VIDEO_DIR . $video_id . '_metadata.json';
            if (!file_put_contents($video_record_file, json_encode($video_data, JSON_PRETTY_PRINT))) {
                if (file_exists($upload_path)) {
                    unlink($upload_path);
                }
                sendJSON(['success' => false, 'error' => 'Failed to save metadata'], 500);
            }
        }
        
        // Also save to simple text file for easy display
        $metadata_file = VIDEO_DIR . 'metadata.txt';
        $metadata_line = json_encode($video_data) . "\n";
        file_put_contents($metadata_file, $metadata_line, FILE_APPEND);
        
        sendJSON([
            'success' => true,
            'message' => 'Video uploaded successfully',
            'video_id' => $video_id,
            'data' => $video_data
        ]);
    }
    
} catch(Exception $e) {
    error_log('Upload error: ' . $e->getMessage());
    sendJSON(['success' => false, 'error' => 'Internal server error'], 500);
}
?>
