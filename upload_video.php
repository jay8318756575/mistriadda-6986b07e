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
    // Check if file was uploaded
    if (!isset($_FILES['video'])) {
        sendJSON(['success' => false, 'error' => 'No video file provided'], 400);
    }
    
    if ($_FILES['video']['error'] !== UPLOAD_ERR_OK) {
        $upload_errors = [
            UPLOAD_ERR_INI_SIZE => 'File too large (server limit)',
            UPLOAD_ERR_FORM_SIZE => 'File too large (form limit)',
            UPLOAD_ERR_PARTIAL => 'File partially uploaded',
            UPLOAD_ERR_NO_FILE => 'No file uploaded',
            UPLOAD_ERR_NO_TMP_DIR => 'No temporary directory',
            UPLOAD_ERR_CANT_WRITE => 'Cannot write to disk',
            UPLOAD_ERR_EXTENSION => 'Upload stopped by extension'
        ];
        $error_msg = $upload_errors[$_FILES['video']['error']] ?? 'Unknown upload error';
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
    
    $video_file = $_FILES['video'];
    $file_size = $video_file['size'];
    $file_type = $video_file['type'];
    $file_name = $video_file['name'];
    
    // Validate file size (max 500MB - increased for longer videos)
    if ($file_size > 500 * 1024 * 1024) {
        sendJSON(['success' => false, 'error' => 'File size too large. Maximum 500MB allowed'], 400);
    }
    
    // Validate file type - be more lenient with MIME types
    $allowed_types = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    $file_extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    $allowed_extensions = ['mp4', 'avi', 'mov', 'wmv', 'webm'];
    
    if (!in_array($file_type, $allowed_types) && !in_array($file_extension, $allowed_extensions)) {
        sendJSON(['success' => false, 'error' => 'Invalid file type. Only video files (MP4, AVI, MOV, WMV, WEBM) allowed'], 400);
    }
    
    // Generate unique filename
    $video_id = generateUUID();
    $file_extension = pathinfo($file_name, PATHINFO_EXTENSION);
    $new_filename = $video_id . '.' . $file_extension;
    $upload_path = VIDEO_DIR . $new_filename;
    
    // Move uploaded file
    if (!move_uploaded_file($video_file['tmp_name'], $upload_path)) {
        error_log('Failed to move uploaded file from ' . $video_file['tmp_name'] . ' to ' . $upload_path);
        sendJSON(['success' => false, 'error' => 'Failed to save video file. Check uploads folder permissions.'], 500);
    }
    
    // Create video record
    $video_data = [
        'id' => $video_id,
        'mistri_id' => $mistri_id,
        'title' => $title,
        'description' => $description,
        'video_url' => $upload_path,
        'thumbnail_url' => '', // Could generate thumbnail later
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
            
            sendJSON([
                'success' => true,
                'message' => 'Video uploaded successfully',
                'video_id' => $video_id,
                'data' => $video_data
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