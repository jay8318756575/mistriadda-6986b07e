<?php
require_once 'config.php';

// Start session
session_start();

/**
 * Hash password securely
 */
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
}

/**
 * Verify password
 */
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Generate secure JWT token (simple version)
 */
function generateJWT($userId, $phone) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'user_id' => $userId,
        'phone' => $phone,
        'iat' => time(),
        'exp' => time() + (24 * 60 * 60) // 24 hours
    ]);
    
    $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    
    $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, 'your-secret-key', true);
    $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    return $base64Header . "." . $base64Payload . "." . $base64Signature;
}

/**
 * Verify JWT token
 */
function verifyJWT($token) {
    try {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return false;
        
        $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[0]));
        $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1]));
        $signature = $parts[2];
        
        $expectedSignature = hash_hmac('sha256', $parts[0] . "." . $parts[1], 'your-secret-key', true);
        $expectedSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($expectedSignature));
        
        if ($signature !== $expectedSignature) return false;
        
        $payloadData = json_decode($payload, true);
        if ($payloadData['exp'] < time()) return false;
        
        return $payloadData;
    } catch (Exception $e) {
        return false;
    }
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    if (isset($_SESSION['user_id']) && isset($_SESSION['phone'])) {
        return true;
    }
    
    // Check JWT token in Authorization header
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $token = str_replace('Bearer ', '', $headers['Authorization']);
        $payload = verifyJWT($token);
        if ($payload) {
            $_SESSION['user_id'] = $payload['user_id'];
            $_SESSION['phone'] = $payload['phone'];
            return true;
        }
    }
    
    return false;
}

/**
 * Get current authenticated user
 */
function getCurrentUser() {
    if (!isAuthenticated()) return null;
    
    $pdo = getDBConnection();
    if (!$pdo) return null;
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ? AND phone = ?");
        $stmt->execute([$_SESSION['user_id'], $_SESSION['phone']]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return null;
    }
}

/**
 * Require authentication
 */
function requireAuth() {
    if (!isAuthenticated()) {
        sendJSON(['error' => 'Authentication required'], 401);
    }
}

/**
 * Logout user
 */
function logout() {
    session_destroy();
    sendJSON(['message' => 'Logged out successfully']);
}

// Handle auth requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_GET['action'] ?? '';
    
    switch ($action) {
        case 'signup':
            handleSignup();
            break;
        case 'login':
            handleLogin();
            break;
        case 'logout':
            logout();
            break;
        case 'verify':
            handleTokenVerification();
            break;
        default:
            sendJSON(['error' => 'Invalid action'], 400);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';
    
    switch ($action) {
        case 'user':
            $user = getCurrentUser();
            if ($user) {
                unset($user['password']); // Don't send password
                sendJSON(['user' => $user]);
            } else {
                sendJSON(['error' => 'User not found'], 404);
            }
            break;
        default:
            sendJSON(['error' => 'Invalid action'], 400);
    }
}

function handleSignup() {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input['name'] || !$input['phone'] || !$input['password']) {
            sendJSON(['error' => 'Name, phone, and password are required'], 400);
        }
        
        $pdo = getDBConnection();
        if (!$pdo) {
            sendJSON(['error' => 'Database connection failed'], 500);
        }
        
        // Check if user already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE phone = ? OR email = ?");
        $stmt->execute([$input['phone'], $input['email'] ?? '']);
        
        if ($stmt->fetch()) {
            sendJSON(['error' => 'User already exists'], 409);
        }
        
        // Create new user
        $hashedPassword = hashPassword($input['password']);
        $stmt = $pdo->prepare("INSERT INTO users (name, phone, email, password, user_type) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $input['name'],
            $input['phone'],
            $input['email'] ?? null,
            $hashedPassword,
            $input['user_type'] ?? 'customer'
        ]);
        
        $userId = $pdo->lastInsertId();
        
        // Create session
        $_SESSION['user_id'] = $userId;
        $_SESSION['phone'] = $input['phone'];
        
        // Generate JWT token
        $token = generateJWT($userId, $input['phone']);
        
        sendJSON([
            'message' => 'User created successfully',
            'user_id' => $userId,
            'token' => $token,
            'requires_otp_verification' => true
        ]);
        
    } catch (PDOException $e) {
        sendJSON(['error' => 'Database error: ' . $e->getMessage()], 500);
    } catch (Exception $e) {
        sendJSON(['error' => 'Server error'], 500);
    }
}

function handleLogin() {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input['phone'] || !$input['password']) {
            sendJSON(['error' => 'Phone and password are required'], 400);
        }
        
        $pdo = getDBConnection();
        if (!$pdo) {
            sendJSON(['error' => 'Database connection failed'], 500);
        }
        
        // Find user
        $stmt = $pdo->prepare("SELECT * FROM users WHERE phone = ?");
        $stmt->execute([$input['phone']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user || !verifyPassword($input['password'], $user['password'])) {
            sendJSON(['error' => 'Invalid credentials'], 401);
        }
        
        // Create session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['phone'] = $user['phone'];
        
        // Generate JWT token
        $token = generateJWT($user['id'], $user['phone']);
        
        unset($user['password']); // Don't send password
        
        sendJSON([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ]);
        
    } catch (PDOException $e) {
        sendJSON(['error' => 'Database error'], 500);
    } catch (Exception $e) {
        sendJSON(['error' => 'Server error'], 500);
    }
}

function handleTokenVerification() {
    $user = getCurrentUser();
    if ($user) {
        unset($user['password']);
        sendJSON(['valid' => true, 'user' => $user]);
    } else {
        sendJSON(['valid' => false], 401);
    }
}
?>