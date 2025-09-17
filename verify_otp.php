<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSON(['error' => 'Only POST method allowed'], 405);
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    $phone = isset($input['phone']) ? trim($input['phone']) : '';
    $otp = isset($input['otp']) ? trim($input['otp']) : '';
    
    if (empty($phone) || empty($otp)) {
        sendJSON(['error' => 'Phone number and OTP are required'], 400);
    }
    
    $pdo = getDBConnection();
    if ($pdo) {
        try {
            // Check OTP
            $stmt = $pdo->prepare("SELECT * FROM otp_verifications WHERE phone = ? AND otp = ? AND is_verified = FALSE AND expires_at > NOW()");
            $stmt->execute([$phone, $otp]);
            $otp_record = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$otp_record) {
                sendJSON(['error' => 'Invalid or expired OTP'], 400);
            }
            
            // Mark OTP as verified
            $stmt = $pdo->prepare("UPDATE otp_verifications SET is_verified = TRUE WHERE id = ?");
            $stmt->execute([$otp_record['id']]);
            
        } catch(PDOException $e) {
            throw $e;
        }
    } else {
        // File-based storage
        $otp_file = UPLOAD_DIR . 'otp_' . $phone . '.json';
        
        if (!file_exists($otp_file)) {
            sendJSON(['error' => 'OTP not found'], 400);
        }
        
        $otp_data = json_decode(file_get_contents($otp_file), true);
        
        if (!$otp_data || 
            $otp_data['otp'] !== $otp || 
            $otp_data['is_verified'] === true ||
            strtotime($otp_data['expires_at']) < time()) {
            sendJSON(['error' => 'Invalid or expired OTP'], 400);
        }
        
        // Mark as verified
        $otp_data['is_verified'] = true;
        file_put_contents($otp_file, json_encode($otp_data, JSON_PRETTY_PRINT));
    }
    
    sendJSON([
        'success' => true,
        'message' => 'OTP verified successfully',
        'phone_verified' => true
    ]);
    
} catch(Exception $e) {
    error_log('OTP verification error: ' . $e->getMessage());
    sendJSON(['error' => 'Internal server error: ' . $e->getMessage()], 500);
}
?>