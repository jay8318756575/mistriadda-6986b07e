<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSON(['error' => 'Only POST method allowed'], 405);
}

try {
    // Check if file was uploaded
    if (!isset($_FILES['video']) || $_FILES['video']['error'] !== UPLOAD_ERR_OK) {
        sendJSON(['error' => 'No video file uploaded or upload error'], 400);
    }
    
    // Get form data
    $mistri_id = isset($_POST['mistri_id']) ? trim($_POST['mistri_id']) : '';
    $title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $description = isset($_POST['description']) ? trim($_POST['description']) : '';
    $category = isset($_POST['category']) ? trim($_POST['category']) : '';
    
    // Validate required fields
    if (empty($mistri_id) || empty($title)) {
        sendJSON(['error' => 'Mistri ID and title are required'], 400);
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
        sendJSON(['error' => 'Mistri profile not found'], 404);
    }
    
    $video_file = $_FILES['video'];
    $file_size = $video_file['size'];
    $file_type = $video_file['type'];
    $file_name = $video_file['name'];
    
    // Validate file size (max 100MB)
    if ($file_size > 100 * 1024 * 1024) {
        sendJSON(['error' => 'File size too large. Maximum 100MB allowed'], 400);
    }
    
    // Validate file type
    $allowed_types = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm', 'video/quicktime'];
    if (!in_array($file_type, $allowed_types)) {
        sendJSON(['error' => 'Invalid file type. Only video files (MP4, AVI, MOV, WMV, WEBM) allowed'], 400);
    }
    
    // Generate unique filename
    $video_id = generateUUID();
    $file_extension = pathinfo($file_name, PATHINFO_EXTENSION);
    $new_filename = $video_id . '.' . $file_extension;
    $upload_path = VIDEO_DIR . $new_filename;
    
    // Move uploaded file
    if (!move_uploaded_file($video_file['tmp_name'], $upload_path)) {
        sendJSON(['error' => 'Failed to upload video file'], 500);
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
            throw $e;
        }
    } else {
        // Fallback to file storage
        $video_record_file = VIDEO_DIR . $video_id . '_metadata.json';
        if (!file_put_contents($video_record_file, json_encode($video_data, JSON_PRETTY_PRINT))) {
            // Delete uploaded file on error
            if (file_exists($upload_path)) {
                unlink($upload_path);
            }
            sendJSON(['error' => 'Failed to save video metadata'], 500);
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
    sendJSON(['error' => 'Internal server error: ' . $e->getMessage()], 500);
}
?>