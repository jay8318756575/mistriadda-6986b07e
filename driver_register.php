<?php
require_once 'config.php';
require_once 'auth.php';

// Require authentication
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSON(['error' => 'Only POST method allowed'], 405);
}

try {
    $currentUser = getCurrentUser();
    if (!$currentUser) {
        sendJSON(['error' => 'User not found'], 404);
    }
    
    // Get form data
    $licenseNumber = $_POST['license_number'] ?? '';
    $vehicleType = $_POST['vehicle_type'] ?? '';
    $vehicleNumber = $_POST['vehicle_number'] ?? '';
    
    // Validate required fields
    if (empty($licenseNumber) || empty($vehicleType) || empty($vehicleNumber)) {
        sendJSON(['error' => 'License number, vehicle type, and vehicle number are required'], 400);
    }
    
    $pdo = getDBConnection();
    if (!$pdo) {
        sendJSON(['error' => 'Database connection failed'], 500);
    }
    
    // Check if driver already registered
    $stmt = $pdo->prepare("SELECT id FROM drivers WHERE user_id = ?");
    $stmt->execute([$currentUser['id']]);
    
    if ($stmt->fetch()) {
        sendJSON(['error' => 'Driver already registered'], 409);
    }
    
    // Handle file uploads
    $licenseImagePath = null;
    $vehicleImagePath = null;
    
    // Upload license image
    if (isset($_FILES['license_image']) && $_FILES['license_image']['error'] === UPLOAD_ERR_OK) {
        $licenseImagePath = uploadFile($_FILES['license_image'], 'license_');
    }
    
    // Upload vehicle image
    if (isset($_FILES['vehicle_image']) && $_FILES['vehicle_image']['error'] === UPLOAD_ERR_OK) {
        $vehicleImagePath = uploadFile($_FILES['vehicle_image'], 'vehicle_');
    }
    
    // Insert driver record
    $stmt = $pdo->prepare("
        INSERT INTO drivers (user_id, license_number, license_image, vehicle_type, vehicle_number, vehicle_image) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $currentUser['id'],
        $licenseNumber,
        $licenseImagePath,
        $vehicleType,
        $vehicleNumber,
        $vehicleImagePath
    ]);
    
    // Update user type
    $stmt = $pdo->prepare("UPDATE users SET user_type = 'driver' WHERE id = ?");
    $stmt->execute([$currentUser['id']]);
    
    sendJSON([
        'message' => 'Driver registration successful',
        'driver_id' => $pdo->lastInsertId(),
        'status' => 'pending_approval'
    ]);
    
} catch (PDOException $e) {
    sendJSON(['error' => 'Database error: ' . $e->getMessage()], 500);
} catch (Exception $e) {
    sendJSON(['error' => 'Server error: ' . $e->getMessage()], 500);
}

function uploadFile($file, $prefix = '') {
    // Validate file type
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!in_array($file['type'], $allowedTypes)) {
        throw new Exception('Invalid file type. Only JPG and PNG allowed.');
    }
    
    // Validate file size (max 5MB)
    if ($file['size'] > 5 * 1024 * 1024) {
        throw new Exception('File too large. Maximum size is 5MB.');
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = $prefix . generateUUID() . '.' . $extension;
    $uploadPath = UPLOAD_DIR . 'drivers/' . $filename;
    
    // Create directory if it doesn't exist
    if (!file_exists(UPLOAD_DIR . 'drivers/')) {
        mkdir(UPLOAD_DIR . 'drivers/', 0755, true);
    }
    
    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        throw new Exception('Failed to upload file');
    }
    
    return $uploadPath;
}
?>