<?php
require_once 'config.php';

// Enable error logging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSON(['success' => false, 'error' => 'Only POST method allowed'], 405);
}

try {
    // Debug logging
    error_log('POST data: ' . print_r($_POST, true));
    error_log('FILES data: ' . print_r($_FILES, true));
    error_log('Content-Type: ' . ($_SERVER['CONTENT_TYPE'] ?? 'not set'));
    
    // Check upload type from POST
    $uploadType = isset($_POST['type']) ? $_POST['type'] : 'video';
    
    // Check if file was uploaded - support multiple field names
    $file_field = null;
    if (isset($_FILES['video'])) {
        $file_field = 'video';
    } elseif (isset($_FILES['photo'])) {
        $file_field = 'photo';
    } elseif (isset($_FILES['file'])) {
        $file_field = 'file';
    }
    
    if (!$file_field) {
        sendJSON(['success' => false, 'error' => 'No file provided. FILES: ' . json_encode(array_keys($_FILES))], 400);
    }
    
    $video_field = $file_field;
    
    if ($_FILES[$video_field]['error'] !== UPLOAD_ERR_OK) {
        $upload_errors = [
            UPLOAD_ERR_INI_SIZE => 'File too large (server limit)',
            UPLOAD_ERR_FORM_SIZE => 'File too large (form limit)',
            UPLOAD_ERR_PARTIAL => 'File partially uploaded',
            UPLOAD_ERR_NO_FILE => 'No file uploaded',
            UPLOAD_ERR_NO_TMP_DIR => 'No temporary directory',
            UPLOAD_ERR_CANT_WRITE => 'Cannot write to disk',
            UPLOAD_ERR_EXTENSION => 'Upload stopped by extension'
        ];
        $error_msg = $upload_errors[$_FILES[$video_field]['error']] ?? 'Unknown upload error';
        sendJSON(['success' => false, 'error' => $error_msg], 400);
    }
    
    // Get form data
    $mistri_id = isset($_POST['mistri_id']) ? trim($_POST['mistri_id']) : '';
    $title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $description = isset($_POST['description']) ? trim($_POST['description']) : '';
    $category = isset($_POST['category']) ? trim($_POST['category']) : '';
    
    // Validate required fields
    if (empty($mistri_id) || empty($title)) {
        sendJSON(['success' => false, 'error' => 'Mistri ID and title are required'], 400);
    }
    
    // Check if mistri exists
    $mistri_exists = false;
    $pdo = getDBConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT id, name, category FROM mistris WHERE id = ?");
            $stmt->execute([$mistri_id]);
            $mistri_data = $stmt->fetch(PDO::FETCH_ASSOC);
            $mistri_exists = $mistri_data !== false;
        } catch(PDOException $e) {
            // Continue with file check
        }
    } else {
        // Check in file storage
        $profile_file = PROFILE_DIR . $mistri_id . '.json';
        if (file_exists($profile_file)) {
            $mistri_data = json_decode(file_get_contents($profile_file), true);
            $mistri_exists = $mistri_data !== null;
        }
    }
    
    if (!$mistri_exists) {
        sendJSON(['success' => false, 'error' => 'Mistri profile not found'], 404);
    }
    
    $uploaded_file = $_FILES[$video_field];
    $file_size = $uploaded_file['size'];
    $file_type = $uploaded_file['type'];
    $file_name = $uploaded_file['name'];
    $file_extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    
    error_log('File upload details: ' . json_encode([
        'type' => $uploadType,
        'name' => $file_name,
        'size' => $file_size,
        'mime_type' => $file_type,
        'tmp_name' => $uploaded_file['tmp_name']
    ]));
    
    // Handle based on upload type
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
        // Validate file size (max 500MB - increased for longer videos)
        if ($file_size > 500 * 1024 * 1024) {
            sendJSON(['success' => false, 'error' => 'File size too large. Maximum 500MB allowed'], 400);
        }
        
        // Validate file type - be more lenient with MIME types
        $allowed_types = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
        $allowed_extensions = ['mp4', 'avi', 'mov', 'wmv', 'webm'];
        
        if (!in_array($file_type, $allowed_types) && !in_array($file_extension, $allowed_extensions)) {
            sendJSON(['success' => false, 'error' => 'Invalid file type. Only video files (MP4, AVI, MOV, WMV, WEBM) allowed'], 400);
        }
    
        // Generate unique filename for video
        $video_id = generateUUID();
        $new_filename = 'video_' . $video_id . '.' . $file_extension;
        $upload_path = VIDEO_DIR . $new_filename;
    }
    
    // Move uploaded file
    if (!move_uploaded_file($uploaded_file['tmp_name'], $upload_path)) {
        error_log('Failed to move uploaded file from ' . $uploaded_file['tmp_name'] . ' to ' . $upload_path);
        sendJSON(['success' => false, 'error' => 'Failed to save file. Check uploads folder permissions.'], 500);
    }
    
    // Set proper permissions
    chmod($upload_path, 0644);
    
    // Save metadata based on upload type
    if ($uploadType === 'photo') {
        $metadata = [
            'id' => $unique_id,
            'filename' => $new_filename,
            'original_name' => $file_name,
            'file_size' => $file_size,
            'file_type' => $file_type,
            'upload_date' => date('Y-m-d H:i:s'),
            'url' => 'uploads/photos/' . $new_filename
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
        // Create video record
        $video_data = [
            'id' => $video_id,
            'mistri_id' => $mistri_id,
            'title' => $title,
            'description' => $description,
            'video_url' => 'uploads/videos/' . $new_filename,
            'filename' => $new_filename,
            'thumbnail_url' => '',
            'views' => 0,
            'likes' => 0,
            'is_active' => true,
            'is_featured' => false,
            'category' => $category ?: ($mistri_data['category'] ?? ''),
            'mistri_name' => $mistri_data['name'] ?? '',
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        // Try database first
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("INSERT INTO mistri_videos (id, mistri_id, title, description, video_url, thumbnail_url, views, likes, is_active, is_featured, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $video_data['id'],
                    $video_data['mistri_id'],
                    $video_data['title'],
                    $video_data['description'],
                    $video_data['video_url'],
                    $video_data['thumbnail_url'],
                    $video_data['views'],
                    $video_data['likes'],
                    $video_data['is_active'],
                    $video_data['is_featured'],
                    $video_data['created_at']
                ]);
                
            } catch(PDOException $e) {
                // Delete uploaded file on database error
                if (file_exists($upload_path)) {
                    unlink($upload_path);
                }
                error_log('Database error in upload_video: ' . $e->getMessage());
                sendJSON(['success' => false, 'error' => 'Database error: ' . $e->getMessage()], 500);
            }
        } else {
            // Fallback to file storage
            $video_record_file = VIDEO_DIR . $video_id . '_metadata.json';
            if (!file_put_contents($video_record_file, json_encode($video_data, JSON_PRETTY_PRINT))) {
                // Delete uploaded file on error
                if (file_exists($upload_path)) {
                    unlink($upload_path);
                }
                error_log('Failed to save video metadata to ' . $video_record_file);
                sendJSON(['success' => false, 'error' => 'Failed to save video metadata'], 500);
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
    error_log('Video upload error: ' . $e->getMessage());
    sendJSON(['success' => false, 'error' => 'Internal server error: ' . $e->getMessage()], 500);
}
?>