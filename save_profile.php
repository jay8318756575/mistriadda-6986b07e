<?php
require_once 'config.php';

// Enable error logging
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors to user
ini_set('log_errors', 1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSON(['success' => false, 'error' => 'Only POST method allowed'], 405);
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
            sendJSON(['success' => false, 'error' => "Field '$field' is required"], 400);
        }
    }
    
    $is_update = !empty($input['id']);
    $mistri_id = $is_update ? trim($input['id']) : generateUUID();

    // Defaults
    $created_at = date('Y-m-d H:i:s');
    $is_verified = false;
    $rating = null;

    // Try database first
    $pdo = getDBConnection();

    // If update, try to preserve existing fields
    if ($is_update) {
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("SELECT created_at, is_verified, rating FROM mistris WHERE id = ? LIMIT 1");
                $stmt->execute([$mistri_id]);
                $existing = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($existing) {
                    if (!empty($existing['created_at'])) $created_at = $existing['created_at'];
                    $is_verified = (bool)($existing['is_verified'] ?? false);
                    $rating = $existing['rating'] ?? null;
                }
            } catch(PDOException $e) {
                // ignore
            }
        } else {
            $existing_file = PROFILE_DIR . $mistri_id . '.json';
            if (file_exists($existing_file)) {
                $existing = json_decode(file_get_contents($existing_file), true);
                if ($existing) {
                    if (!empty($existing['created_at'])) $created_at = $existing['created_at'];
                    $is_verified = (bool)($existing['is_verified'] ?? false);
                    $rating = $existing['rating'] ?? null;
                }
            }
        }
    }

    $profile_data = [
        'id' => $mistri_id,
        'name' => trim($input['name']),
        'phone' => trim($input['phone']),
        'location' => trim($input['location']),
        'category' => trim($input['category']),
        'experience_years' => isset($input['experience_years']) ? (int)$input['experience_years'] : 0,
        'description' => isset($input['description']) ? trim($input['description']) : '',
        'profile_image' => isset($input['profile_image']) ? trim($input['profile_image']) : '',
        'address' => isset($input['address']) ? trim($input['address']) : '',
        'is_verified' => $is_verified,
        'rating' => $rating,
        'created_at' => $created_at
    ];

    if ($pdo) {
        try {
            if ($is_update) {
                $stmt = $pdo->prepare("UPDATE mistris SET name = ?, phone = ?, location = ?, category = ?, experience_years = ?, description = ?, profile_image = ?, address = ? WHERE id = ?");
                $stmt->execute([
                    $profile_data['name'],
                    $profile_data['phone'],
                    $profile_data['location'],
                    $profile_data['category'],
                    $profile_data['experience_years'],
                    $profile_data['description'],
                    $profile_data['profile_image'],
                    $profile_data['address'],
                    $profile_data['id']
                ]);

                sendJSON([
                    'success' => true,
                    'message' => 'Profile updated successfully',
                    'mistri_id' => $mistri_id,
                    'data' => $profile_data
                ]);
            }

            // Insert new
            $stmt = $pdo->prepare("INSERT INTO mistris (id, name, phone, location, category, experience_years, description, profile_image, address, is_verified, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $profile_data['id'],
                $profile_data['name'],
                $profile_data['phone'],
                $profile_data['location'],
                $profile_data['category'],
                $profile_data['experience_years'],
                $profile_data['description'],
                $profile_data['profile_image'],
                $profile_data['address'],
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
            error_log('Database error in save_profile: ' . $e->getMessage());
            if ($e->getCode() == 23000) { // Duplicate entry
                sendJSON(['success' => false, 'error' => 'Phone number already exists'], 409);
            }
            sendJSON(['success' => false, 'error' => 'Database error: ' . $e->getMessage()], 500);
        }
    }

    // Fallback to file storage
    $filename = PROFILE_DIR . $mistri_id . '.json';

    if (!$is_update) {
        // Check if phone already exists in file storage
        $files = glob(PROFILE_DIR . '*.json');
        foreach ($files as $file) {
            $existing_data = json_decode(file_get_contents($file), true);
            if ($existing_data && $existing_data['phone'] === $profile_data['phone']) {
                sendJSON(['success' => false, 'error' => 'Phone number already exists'], 409);
            }
        }
    }

    if (file_put_contents($filename, json_encode($profile_data, JSON_PRETTY_PRINT))) {
        sendJSON([
            'success' => true,
            'message' => $is_update ? 'Profile updated successfully' : 'Profile saved successfully',
            'mistri_id' => $mistri_id,
            'data' => $profile_data
        ]);
    } else {
        sendJSON(['success' => false, 'error' => $is_update ? 'Failed to update profile file' : 'Failed to save profile to file'], 500);
    }

} catch(Exception $e) {
    error_log('Profile save error: ' . $e->getMessage());
    sendJSON(['success' => false, 'error' => 'Internal server error: ' . $e->getMessage()], 500);
}
?>