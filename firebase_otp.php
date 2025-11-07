<?php
require_once 'config.php';

/**
 * SMS OTP Integration using MSG91 (भारत में काम करता है)
 * Setup: 
 * 1. MSG91 पर अकाउंट बनाएं (https://msg91.com)
 * 2. Template ID और Auth Key लें
 * 3. नीचे दिए गए constants में भरें
 */

// MSG91 Configuration - यहां अपनी details भरें
define('MSG91_AUTH_KEY', 'YOUR_MSG91_AUTH_KEY_HERE'); // MSG91 से मिलेगी
define('MSG91_TEMPLATE_ID', 'YOUR_TEMPLATE_ID_HERE'); // Template ID
define('MSG91_SENDER_ID', 'MSTRAD'); // 6 characters max
define('USE_REAL_SMS', false); // True करें जब MSG91 setup हो जाए

class SMSOTP {
    private $authKey;
    private $templateId;
    private $senderId;
    private $useRealSMS;
    
    public function __construct() {
        $this->authKey = MSG91_AUTH_KEY;
        $this->templateId = MSG91_TEMPLATE_ID;
        $this->senderId = MSG91_SENDER_ID;
        $this->useRealSMS = USE_REAL_SMS;
    }
    
    /**
     * Send OTP via SMS (MSG91 या Mock)
     */
    public function sendOTP($phoneNumber) {
        try {
            // Format phone number
            $formattedPhone = $this->formatPhoneNumber($phoneNumber);
            
            // Generate OTP
            $otp = sprintf('%06d', mt_rand(100000, 999999));
            
            // Send real SMS if enabled
            if ($this->useRealSMS && !empty($this->authKey) && $this->authKey !== 'YOUR_MSG91_AUTH_KEY_HERE') {
                $smsResult = $this->sendRealSMS($formattedPhone, $otp);
                if (!$smsResult['success']) {
                    throw new Exception('SMS भेजने में त्रुटि: ' . $smsResult['error']);
                }
                $sessionInfo = 'real_sms_' . time();
            } else {
                // Mock mode - just store OTP
                $sessionInfo = 'mock_session_' . time();
            }
            
            // Store OTP in database
            $this->storeOTP($phoneNumber, $otp, $sessionInfo);
            
            $response = [
                'success' => true,
                'sessionInfo' => $sessionInfo,
                'message' => 'OTP sent successfully'
            ];
            
            // Show debug OTP only in mock mode
            if (!$this->useRealSMS) {
                $response['debug_otp'] = $otp;
                $response['message'] = 'Demo Mode: OTP नीचे दिखाया गया है';
            }
            
            return $response;
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Send real SMS via MSG91
     */
    private function sendRealSMS($phone, $otp) {
        try {
            // MSG91 API endpoint
            $url = 'https://control.msg91.com/api/v5/otp';
            
            // Remove +91 from phone for MSG91
            $cleanPhone = str_replace(['+91', '+', ' ', '-'], '', $phone);
            
            $data = [
                'template_id' => $this->templateId,
                'mobile' => $cleanPhone,
                'otp' => $otp,
                'sender' => $this->senderId
            ];
            
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'authkey: ' . $this->authKey
            ]);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            if ($httpCode === 200 || $httpCode === 201) {
                return ['success' => true];
            } else {
                return ['success' => false, 'error' => 'SMS API error: ' . $response];
            }
            
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
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
    
    $smsOTP = new SMSOTP();
    
    switch ($action) {
        case 'send':
            if (!isset($input['phone'])) {
                sendJSON(['error' => 'Phone number is required'], 400);
            }
            
            $result = $smsOTP->sendOTP($input['phone']);
            
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
            
            $result = $smsOTP->verifyOTP(
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