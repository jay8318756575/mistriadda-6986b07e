<?php
require_once 'config.php';

/**
 * Firebase OTP Integration
 * Note: This is a mock implementation. For production, you'll need:
 * 1. Firebase Admin SDK for PHP
 * 2. Valid Firebase project credentials
 * 3. Firebase Authentication setup
 */

class FirebaseOTP {
    private $apiKey;
    private $projectId;
    
    public function __construct() {
        // In production, store these in environment variables
        $this->apiKey = 'your-firebase-api-key';
        $this->projectId = 'your-firebase-project-id';
    }
    
    /**
     * Send OTP via Firebase (Mock implementation)
     * In production, use Firebase Admin SDK
     */
    public function sendOTP($phoneNumber) {
        try {
            // Format phone number (ensure it starts with country code)
            $formattedPhone = $this->formatPhoneNumber($phoneNumber);
            
            // For demo purposes, generate a random OTP
            $otp = sprintf('%06d', mt_rand(100000, 999999));
            
            // In production, use Firebase REST API or Admin SDK
            $sessionInfo = $this->mockFirebaseRequest($formattedPhone, $otp);
            
            // Store OTP in database
            $this->storeOTP($phoneNumber, $otp, $sessionInfo);
            
            return [
                'success' => true,
                'sessionInfo' => $sessionInfo,
                'message' => 'OTP sent successfully',
                // For demo purposes only - remove in production
                'debug_otp' => $otp
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Verify OTP via Firebase
     */
    public function verifyOTP($phoneNumber, $otp, $sessionInfo = null) {
        try {
            $pdo = getDBConnection();
            if (!$pdo) {
                throw new Exception('Database connection failed');
            }
            
            // Check OTP in database
            $stmt = $pdo->prepare("
                SELECT * FROM otp_verifications 
                WHERE phone = ? AND otp_code = ? AND status = 'pending' AND expires_at > NOW()
                ORDER BY created_at DESC LIMIT 1
            ");
            $stmt->execute([$phoneNumber, $otp]);
            $otpRecord = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$otpRecord) {
                return [
                    'success' => false,
                    'error' => 'Invalid or expired OTP'
                ];
            }
            
            // Mark OTP as verified
            $stmt = $pdo->prepare("UPDATE otp_verifications SET status = 'verified' WHERE id = ?");
            $stmt->execute([$otpRecord['id']]);
            
            // Mark user as verified if exists
            $stmt = $pdo->prepare("UPDATE users SET is_verified = TRUE WHERE phone = ?");
            $stmt->execute([$phoneNumber]);
            
            return [
                'success' => true,
                'message' => 'OTP verified successfully',
                'phone_verified' => true
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Format phone number for Firebase
     */
    private function formatPhoneNumber($phone) {
        // Remove all non-numeric characters
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        // Add India country code if not present
        if (strlen($phone) === 10) {
            $phone = '+91' . $phone;
        } elseif (strlen($phone) === 12 && substr($phone, 0, 2) === '91') {
            $phone = '+' . $phone;
        } elseif (strlen($phone) === 13 && substr($phone, 0, 3) === '+91') {
            // Already formatted
        } else {
            throw new Exception('Invalid phone number format');
        }
        
        return $phone;
    }
    
    /**
     * Mock Firebase API request (replace with actual Firebase call)
     */
    private function mockFirebaseRequest($phone, $otp) {
        // This is a mock implementation
        // In production, use Firebase REST API:
        /*
        $url = "https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key=" . $this->apiKey;
        $data = [
            'phoneNumber' => $phone,
            'recaptchaToken' => $recaptchaToken
        ];
        
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_HTTPHEADER => ['Content-Type: application/json']
        ]);
        
        $response = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);
        
        if ($httpCode !== 200) {
            throw new Exception('Firebase API error');
        }
        
        $result = json_decode($response, true);
        return $result['sessionInfo'];
        */
        
        // Mock session info
        return 'mock_session_' . time() . '_' . substr(md5($phone), 0, 8);
    }
    
    /**
     * Store OTP in database
     */
    private function storeOTP($phone, $otp, $sessionInfo) {
        $pdo = getDBConnection();
        if (!$pdo) {
            throw new Exception('Database connection failed');
        }
        
        // Clean old OTPs for this phone
        $stmt = $pdo->prepare("UPDATE otp_verifications SET status = 'expired' WHERE phone = ? AND status = 'pending'");
        $stmt->execute([$phone]);
        
        // Insert new OTP
        $stmt = $pdo->prepare("
            INSERT INTO otp_verifications (phone, otp_code, firebase_session_id, expires_at) 
            VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE))
        ");
        $stmt->execute([$phone, $otp, $sessionInfo]);
    }
}

// Handle OTP requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $_GET['action'] ?? $input['action'] ?? '';
    
    $firebaseOTP = new FirebaseOTP();
    
    switch ($action) {
        case 'send':
            if (!isset($input['phone'])) {
                sendJSON(['error' => 'Phone number is required'], 400);
            }
            
            $result = $firebaseOTP->sendOTP($input['phone']);
            
            if ($result['success']) {
                sendJSON($result);
            } else {
                sendJSON(['error' => $result['error']], 400);
            }
            break;
            
        case 'verify':
            if (!isset($input['phone']) || !isset($input['otp'])) {
                sendJSON(['error' => 'Phone number and OTP are required'], 400);
            }
            
            $result = $firebaseOTP->verifyOTP(
                $input['phone'],
                $input['otp'],
                $input['sessionInfo'] ?? null
            );
            
            if ($result['success']) {
                sendJSON($result);
            } else {
                sendJSON(['error' => $result['error']], 400);
            }
            break;
            
        default:
            sendJSON(['error' => 'Invalid action'], 400);
    }
}
?>