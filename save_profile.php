<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSON(['error' => 'Only POST method allowed'], 405);
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendJSON(['error' => 'Invalid JSON data'], 400);
    }
    
    // Validate required fields
    $required = ['name', 'phone', 'location', 'category'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            sendJSON(['error' => "Field '$field' is required"], 400);
        }
    }
    
    $mistri_id = generateUUID();
    $profile_data = [
        'id' => $mistri_id,
        'name' => trim($input['name']),
        'phone' => trim($input['phone']),
        'location' => trim($input['location']),
        'category' => trim($input['category']),
        'experience_years' => isset($input['experience_years']) ? (int)$input['experience_years'] : 0,
        'description' => isset($input['description']) ? trim($input['description']) : '',
        'profile_image' => isset($input['profile_image']) ? trim($input['profile_image']) : '',
        'is_verified' => false,
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    // Try database first
    $pdo = getDBConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("INSERT INTO mistris (id, name, phone, location, category, experience_years, description, profile_image, is_verified, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $profile_data['id'],
                $profile_data['name'],
                $profile_data['phone'],
                $profile_data['location'],
                $profile_data['category'],
                $profile_data['experience_years'],
                $profile_data['description'],
                $profile_data['profile_image'],
                $profile_data['is_verified'],
                $profile_data['created_at']
            ]);
            
            sendJSON([
                'success' => true,
                'message' => 'Profile saved successfully',
                'mistri_id' => $mistri_id,
                'data' => $profile_data
            ]);
        } catch(PDOException $e) {
            if ($e->getCode() == 23000) { // Duplicate entry
                sendJSON(['error' => 'Phone number already exists'], 409);
            }
            throw $e;
        }
    } else {
        // Fallback to file storage
        $filename = PROFILE_DIR . $mistri_id . '.json';
        if (file_put_contents($filename, json_encode($profile_data, JSON_PRETTY_PRINT))) {
            sendJSON([
                'success' => true,
                'message' => 'Profile saved successfully',
                'mistri_id' => $mistri_id,
                'data' => $profile_data
            ]);
        } else {
            sendJSON(['error' => 'Failed to save profile'], 500);
        }
    }
    
} catch(Exception $e) {
    error_log('Profile save error: ' . $e->getMessage());
    sendJSON(['error' => 'Internal server error'], 500);
}
?>