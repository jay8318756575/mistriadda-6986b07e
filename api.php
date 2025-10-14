<?php
require_once 'config.php';

// Get the endpoint from query parameter
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

switch ($endpoint) {
    case 'mistris':
        handleMistrisAPI();
        break;
    case 'videos':
        handleVideosAPI();
        break;
    case 'categories':
        handleCategoriesAPI();
        break;
    default:
        sendJSON(['success' => false, 'error' => 'Invalid endpoint'], 404);
}

function handleMistrisAPI() {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $category = isset($_GET['category']) ? $_GET['category'] : '';
        $location = isset($_GET['location']) ? $_GET['location'] : '';
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        
        $mistris = [];
        
        // Try database first
        $pdo = getDBConnection();
        if ($pdo) {
            try {
                $sql = "SELECT id, name, phone, location, category, experience_years, description, profile_image, is_verified, rating, created_at FROM mistris WHERE 1=1";
                $params = [];
                
                if ($category) {
                    $sql .= " AND category = ?";
                    $params[] = $category;
                }
                
                if ($location) {
                    $sql .= " AND location LIKE ?";
                    $params[] = "%$location%";
                }
                
                $sql .= " ORDER BY created_at DESC LIMIT ?";
                $params[] = $limit;
                
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                $mistris = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                // Normalize data - add mobile field as alias for phone
                foreach ($mistris as &$mistri) {
                    $mistri['mobile'] = $mistri['phone'];
                    $mistri['experience'] = (int)$mistri['experience_years'];
                }
                
            } catch(PDOException $e) {
                error_log('Database error in mistris API: ' . $e->getMessage());
                sendJSON(['success' => false, 'error' => 'Database error: ' . $e->getMessage()], 500);
            }
        } else {
            // Fallback to file storage
            $files = glob(PROFILE_DIR . '*.json');
            foreach ($files as $file) {
                $data = json_decode(file_get_contents($file), true);
                if ($data) {
                    if ((!$category || $data['category'] === $category) && 
                        (!$location || strpos($data['location'], $location) !== false)) {
                        // Normalize data
                        $data['mobile'] = $data['phone'];
                        $data['experience'] = (int)($data['experience_years'] ?? 0);
                        $mistris[] = $data;
                    }
                }
                if (count($mistris) >= $limit) break;
            }
        }
        
        sendJSON(['success' => true, 'data' => $mistris]);
    } else {
        sendJSON(['success' => false, 'error' => 'Method not allowed'], 405);
    }
}

function handleVideosAPI() {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $mistri_id = isset($_GET['mistri_id']) ? $_GET['mistri_id'] : '';
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        
        $videos = [];
        
        // Try database first
        $pdo = getDBConnection();
        if ($pdo) {
            try {
                $sql = "SELECT v.*, m.name as mistri_name, m.category FROM mistri_videos v LEFT JOIN mistris m ON v.mistri_id = m.id WHERE v.is_active = 1";
                $params = [];
                
                if ($mistri_id) {
                    $sql .= " AND v.mistri_id = ?";
                    $params[] = $mistri_id;
                }
                
                $sql .= " ORDER BY v.created_at DESC LIMIT ?";
                $params[] = $limit;
                
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                $videos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch(PDOException $e) {
                error_log('Database error in videos API: ' . $e->getMessage());
                sendJSON(['success' => false, 'error' => 'Database error: ' . $e->getMessage()], 500);
            }
        } else {
            // Fallback to file storage
            $files = glob(VIDEO_DIR . '*_metadata.json');
            foreach ($files as $file) {
                $data = json_decode(file_get_contents($file), true);
                if ($data && $data['is_active']) {
                    if (!$mistri_id || $data['mistri_id'] === $mistri_id) {
                        // Get mistri name
                        $profile_file = PROFILE_DIR . $data['mistri_id'] . '.json';
                        if (file_exists($profile_file)) {
                            $profile_data = json_decode(file_get_contents($profile_file), true);
                            $data['mistri_name'] = $profile_data['name'];
                            $data['category'] = $profile_data['category'];
                        }
                        $videos[] = $data;
                    }
                }
                if (count($videos) >= $limit) break;
            }
        }
        
        sendJSON(['success' => true, 'data' => $videos]);
    } else {
        sendJSON(['success' => false, 'error' => 'Method not allowed'], 405);
    }
}

function handleCategoriesAPI() {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $categories = [
            ['id' => 'plumber', 'name' => 'प्लंबर', 'icon' => 'plumber-icon.png'],
            ['id' => 'electrician', 'name' => 'इलेक्ट्रीशियन', 'icon' => 'electrician-icon.png'],
            ['id' => 'carpenter', 'name' => 'बढ़ई', 'icon' => 'carpenter-icon.png'],
            ['id' => 'painter', 'name' => 'पेंटर', 'icon' => 'painter-icon.png'],
            ['id' => 'mason', 'name' => 'राजमिस्त्री', 'icon' => 'mason-icon.png'],
            ['id' => 'mechanic', 'name' => 'मैकेनिक', 'icon' => 'mechanic-icon.png'],
            ['id' => 'pop_ceiling', 'name' => 'POP छत', 'icon' => 'pop-ceiling-icon.png'],
            ['id' => 'gypsum_board', 'name' => 'जिप्सम बोर्ड', 'icon' => 'gypsum-board-icon.png'],
            ['id' => 'kabadi', 'name' => 'कबाड़ी', 'icon' => 'kabadi-icon.png']
        ];
        
        sendJSON(['success' => true, 'data' => $categories]);
    } else {
        sendJSON(['success' => false, 'error' => 'Method not allowed'], 405);
    }
}
?>