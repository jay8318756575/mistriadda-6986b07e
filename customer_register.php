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
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Get profile data
    $location = $input['location'] ?? '';
    $bio = $input['bio'] ?? '';
    
    // Validate required fields
    if (empty($location)) {
        sendJSON(['error' => 'Location is required'], 400);
    }
    
    $pdo = getDBConnection();
    if (!$pdo) {
        sendJSON(['error' => 'Database connection failed'], 500);
    }
    
    // Check if profile already exists
    $stmt = $pdo->prepare("SELECT id FROM profiles WHERE user_id = ?");
    $stmt->execute([$currentUser['id']]);
    
    if ($stmt->fetch()) {
        // Update existing profile
        $stmt = $pdo->prepare("UPDATE profiles SET location = ?, bio = ?, updated_at = NOW() WHERE user_id = ?");
        $stmt->execute([$location, $bio, $currentUser['id']]);
        $message = 'Customer profile updated successfully';
    } else {
        // Create new profile
        $stmt = $pdo->prepare("
            INSERT INTO profiles (user_id, location, bio, category) 
            VALUES (?, ?, ?, 'customer')
        ");
        $stmt->execute([$currentUser['id'], $location, $bio]);
        $message = 'Customer profile created successfully';
    }
    
    // Update user type
    $stmt = $pdo->prepare("UPDATE users SET user_type = 'customer' WHERE id = ?");
    $stmt->execute([$currentUser['id']]);
    
    // Get updated profile
    $stmt = $pdo->prepare("
        SELECT p.*, u.name, u.phone, u.email 
        FROM profiles p 
        JOIN users u ON p.user_id = u.id 
        WHERE p.user_id = ?
    ");
    $stmt->execute([$currentUser['id']]);
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);
    
    sendJSON([
        'message' => $message,
        'profile' => $profile
    ]);
    
} catch (PDOException $e) {
    sendJSON(['error' => 'Database error: ' . $e->getMessage()], 500);
} catch (Exception $e) {
    sendJSON(['error' => 'Server error: ' . $e->getMessage()], 500);
}
?>