<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSON(['error' => 'Only POST method allowed'], 405);
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || empty($input['phone'])) {
        sendJSON(['error' => 'Phone number is required'], 400);
    }
    
    $phone = trim($input['phone']);
    $action = isset($input['action']) ? $input['action'] : 'send'; // 'send' or 'verify'
    
    if ($action === 'send') {
        // Generate OTP
        $otp = sprintf('%06d', mt_rand(100000, 999999));
        $expires_at = date('Y-m-d H:i:s', time() + 300); // 5 minutes
        
        $otp_data = [
            'id' => generateUUID(),
            'phone' => $phone,
            'otp' => $otp,
            'is_verified' => false,
            'expires_at' => $expires_at,
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        // Try database first
        $pdo = getDBConnection();
        if ($pdo) {
            try {
                // Delete old OTPs for this phone
                $stmt = $pdo->prepare("DELETE FROM otp_verifications WHERE phone = ?");
                $stmt->execute([$phone]);
                
                // Insert new OTP
                $stmt = $pdo->prepare("INSERT INTO otp_verifications (id, phone, otp, is_verified, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $otp_data['id'],
                    $otp_data['phone'],
                    $otp_data['otp'],
                    $otp_data['is_verified'],
                    $otp_data['expires_at'],
                    $otp_data['created_at']
                ]);
            } catch(PDOException $e) {
                throw $e;
            }
        } else {
            // Fallback to file storage
            $filename = UPLOAD_DIR . 'otp_' . preg_replace('/[^0-9]/', '', $phone) . '.json';
            file_put_contents($filename, json_encode($otp_data, JSON_PRETTY_PRINT));
        }
        
        // In production, integrate with SMS service like Twilio, MSG91, etc.
        // For development/testing, we'll just return the OTP
        sendJSON([
            'success' => true,
            'message' => 'OTP sent successfully',
            'otp' => $otp, // Remove this in production
            'expires_at' => $expires_at
        ]);
        
    } elseif ($action === 'verify') {
        if (empty($input['otp'])) {
            sendJSON(['error' => 'OTP is required'], 400);
        }
        
        $otp = trim($input['otp']);
        $verified = false;
        
        // Try database first
        $pdo = getDBConnection();
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("SELECT * FROM otp_verifications WHERE phone = ? AND otp = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1");
                $stmt->execute([$phone, $otp]);
                $otp_record = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($otp_record) {
                    // Mark as verified
                    $stmt = $pdo->prepare("UPDATE otp_verifications SET is_verified = TRUE WHERE id = ?");
                    $stmt->execute([$otp_record['id']]);
                    $verified = true;
                }
            } catch(PDOException $e) {
                throw $e;
            }
        } else {
            // Fallback to file storage
            $filename = UPLOAD_DIR . 'otp_' . preg_replace('/[^0-9]/', '', $phone) . '.json';
            if (file_exists($filename)) {
                $otp_data = json_decode(file_get_contents($filename), true);
                if ($otp_data && $otp_data['otp'] === $otp && strtotime($otp_data['expires_at']) > time()) {
                    $otp_data['is_verified'] = true;
                    file_put_contents($filename, json_encode($otp_data, JSON_PRETTY_PRINT));
                    $verified = true;
                }
            }
        }
        
        if ($verified) {
            sendJSON([
                'success' => true,
                'message' => 'OTP verified successfully',
                'verified' => true
            ]);
        } else {
            sendJSON(['error' => 'Invalid or expired OTP'], 400);
        }
    } else {
        sendJSON(['error' => 'Invalid action'], 400);
    }
    
} catch(Exception $e) {
    error_log('OTP error: ' . $e->getMessage());
    sendJSON(['error' => 'Internal server error'], 500);
}
?>