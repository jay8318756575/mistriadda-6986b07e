<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJSON(['error' => 'Only GET method allowed'], 405);
}

try {
    $type = isset($_GET['type']) ? $_GET['type'] : '';
    
    switch ($type) {
        case 'mistris':
            getMistris();
            break;
        case 'videos':
            getVideos();
            break;
        case 'categories':
            getCategories();
            break;
        case 'mistri':
            getSingleMistri();
            break;
        default:
            sendJSON(['error' => 'Invalid type parameter'], 400);
    }
    
} catch(Exception $e) {
    error_log('Get data error: ' . $e->getMessage());
    sendJSON(['error' => 'Internal server error'], 500);
}

function getMistris() {
    $category = isset($_GET['category']) ? $_GET['category'] : '';
    $location = isset($_GET['location']) ? $_GET['location'] : '';
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    
    $mistris = [];
    
    // Try database first
    $pdo = getDBConnection();
    if ($pdo) {
        try {
            $sql = "SELECT * FROM mistris WHERE 1=1";
            $params = [];
            
            if ($category && $category !== 'all') {
                $sql .= " AND category = ?";
                $params[] = $category;
            }
            
            if ($location) {
                $sql .= " AND location LIKE ?";
                $params[] = "%$location%";
            }
            
            if ($search) {
                $sql .= " AND (name LIKE ? OR description LIKE ? OR category LIKE ?)";
                $params[] = "%$search%";
                $params[] = "%$search%";
                $params[] = "%$search%";
            }
            
            $sql .= " ORDER BY rating DESC, created_at DESC LIMIT ?";
            $params[] = $limit;
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $mistris = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Get video count for each mistri
            foreach ($mistris as &$mistri) {
                $stmt = $pdo->prepare("SELECT COUNT(*) as video_count FROM mistri_videos WHERE mistri_id = ? AND is_active = 1");
                $stmt->execute([$mistri['id']]);
                $video_count = $stmt->fetch(PDO::FETCH_ASSOC);
                $mistri['video_count'] = $video_count['video_count'];
            }
            
        } catch(PDOException $e) {
            sendJSON(['error' => 'Database error: ' . $e->getMessage()], 500);
        }
    } else {
        // Fallback to file storage
        $files = glob(PROFILE_DIR . '*.json');
        foreach ($files as $file) {
            $data = json_decode(file_get_contents($file), true);
            if ($data) {
                $match = true;
                
                if ($category && $category !== 'all' && $data['category'] !== $category) {
                    $match = false;
                }
                
                if ($location && strpos(strtolower($data['location']), strtolower($location)) === false) {
                    $match = false;
                }
                
                if ($search) {
                    $searchFields = $data['name'] . ' ' . $data['description'] . ' ' . $data['category'];
                    if (strpos(strtolower($searchFields), strtolower($search)) === false) {
                        $match = false;
                    }
                }
                
                if ($match) {
                    // Count videos for this mistri
                    $video_files = glob(VIDEO_DIR . '*_metadata.json');
                    $video_count = 0;
                    foreach ($video_files as $video_file) {
                        $video_data = json_decode(file_get_contents($video_file), true);
                        if ($video_data && $video_data['mistri_id'] === $data['id'] && $video_data['is_active']) {
                            $video_count++;
                        }
                    }
                    $data['video_count'] = $video_count;
                    $mistris[] = $data;
                }
            }
            if (count($mistris) >= $limit) break;
        }
    }
    
    sendJSON(['success' => true, 'data' => $mistris, 'count' => count($mistris)]);
}

function getVideos() {
    $mistri_id = isset($_GET['mistri_id']) ? $_GET['mistri_id'] : '';
    $category = isset($_GET['category']) ? $_GET['category'] : '';
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $featured = isset($_GET['featured']) ? (bool)$_GET['featured'] : false;
    
    $videos = [];
    
    // Try database first
    $pdo = getDBConnection();
    if ($pdo) {
        try {
            $sql = "SELECT v.*, m.name as mistri_name, m.category, m.location as mistri_location, m.rating as mistri_rating 
                    FROM mistri_videos v 
                    LEFT JOIN mistris m ON v.mistri_id = m.id 
                    WHERE v.is_active = 1";
            $params = [];
            
            if ($mistri_id) {
                $sql .= " AND v.mistri_id = ?";
                $params[] = $mistri_id;
            }
            
            if ($category && $category !== 'all') {
                $sql .= " AND m.category = ?";
                $params[] = $category;
            }
            
            if ($featured) {
                $sql .= " AND v.is_featured = 1";
            }
            
            $sql .= " ORDER BY v.created_at DESC LIMIT ?";
            $params[] = $limit;
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $videos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch(PDOException $e) {
            sendJSON(['error' => 'Database error: ' . $e->getMessage()], 500);
        }
    } else {
        // Fallback to file storage
        $files = glob(VIDEO_DIR . '*_metadata.json');
        foreach ($files as $file) {
            $data = json_decode(file_get_contents($file), true);
            if ($data && $data['is_active']) {
                $match = true;
                
                if ($mistri_id && $data['mistri_id'] !== $mistri_id) {
                    $match = false;
                }
                
                if ($featured && !$data['is_featured']) {
                    $match = false;
                }
                
                if ($match) {
                    // Get mistri details
                    $profile_file = PROFILE_DIR . $data['mistri_id'] . '.json';
                    if (file_exists($profile_file)) {
                        $profile_data = json_decode(file_get_contents($profile_file), true);
                        $data['mistri_name'] = $profile_data['name'];
                        $data['category'] = $profile_data['category'];
                        $data['mistri_location'] = $profile_data['location'];
                        $data['mistri_rating'] = $profile_data['rating'] ?? 0;
                        
                        if ($category && $category !== 'all' && $profile_data['category'] !== $category) {
                            $match = false;
                        }
                    }
                    
                    if ($match) {
                        $videos[] = $data;
                    }
                }
            }
            if (count($videos) >= $limit) break;
        }
        
        // Sort by created_at
        usort($videos, function($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });
    }
    
    sendJSON(['success' => true, 'data' => $videos, 'count' => count($videos)]);
}

function getSingleMistri() {
    $mistri_id = isset($_GET['id']) ? $_GET['id'] : '';
    
    if (empty($mistri_id)) {
        sendJSON(['error' => 'Mistri ID is required'], 400);
    }
    
    $mistri = null;
    
    // Try database first
    $pdo = getDBConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM mistris WHERE id = ?");
            $stmt->execute([$mistri_id]);
            $mistri = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($mistri) {
                // Get videos for this mistri
                $stmt = $pdo->prepare("SELECT * FROM mistri_videos WHERE mistri_id = ? AND is_active = 1 ORDER BY created_at DESC");
                $stmt->execute([$mistri_id]);
                $mistri['videos'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            
        } catch(PDOException $e) {
            sendJSON(['error' => 'Database error: ' . $e->getMessage()], 500);
        }
    } else {
        // Fallback to file storage
        $profile_file = PROFILE_DIR . $mistri_id . '.json';
        if (file_exists($profile_file)) {
            $mistri = json_decode(file_get_contents($profile_file), true);
            
            if ($mistri) {
                // Get videos for this mistri
                $videos = [];
                $video_files = glob(VIDEO_DIR . '*_metadata.json');
                foreach ($video_files as $video_file) {
                    $video_data = json_decode(file_get_contents($video_file), true);
                    if ($video_data && $video_data['mistri_id'] === $mistri_id && $video_data['is_active']) {
                        $videos[] = $video_data;
                    }
                }
                
                // Sort videos by created_at
                usort($videos, function($a, $b) {
                    return strtotime($b['created_at']) - strtotime($a['created_at']);
                });
                
                $mistri['videos'] = $videos;
            }
        }
    }
    
    if ($mistri) {
        sendJSON(['success' => true, 'data' => $mistri]);
    } else {
        sendJSON(['error' => 'Mistri not found'], 404);
    }
}

function getCategories() {
    $categories = [
        ['id' => 'all', 'name' => 'All Categories', 'name_hindi' => 'सभी श्रेणियां', 'icon' => 'all-icon.png'],
        ['id' => 'plumber', 'name' => 'Plumber', 'name_hindi' => 'प्लंबर', 'icon' => 'plumber-icon.png'],
        ['id' => 'electrician', 'name' => 'Electrician', 'name_hindi' => 'इलेक्ट्रीशियन', 'icon' => 'electrician-icon.png'],
        ['id' => 'carpenter', 'name' => 'Carpenter', 'name_hindi' => 'बढ़ई', 'icon' => 'carpenter-icon.png'],
        ['id' => 'painter', 'name' => 'Painter', 'name_hindi' => 'पेंटर', 'icon' => 'painter-icon.png'],
        ['id' => 'mason', 'name' => 'Mason', 'name_hindi' => 'राजमिस्त्री', 'icon' => 'mason-icon.png'],
        ['id' => 'mechanic', 'name' => 'Mechanic', 'name_hindi' => 'मैकेनिक', 'icon' => 'mechanic-icon.png'],
        ['id' => 'pop_ceiling', 'name' => 'POP Ceiling', 'name_hindi' => 'POP छत', 'icon' => 'pop-ceiling-icon.png'],
        ['id' => 'gypsum_board', 'name' => 'Gypsum Board', 'name_hindi' => 'जिप्सम बोर्ड', 'icon' => 'gypsum-board-icon.png'],
        ['id' => 'kabadi', 'name' => 'Scrap Dealer', 'name_hindi' => 'कबाड़ी', 'icon' => 'kabadi-icon.png'],
        ['id' => 'driver', 'name' => 'Driver', 'name_hindi' => 'ड्राइवर', 'icon' => 'driver-icon.png'],
        ['id' => 'cleaner', 'name' => 'Cleaner', 'name_hindi' => 'सफाई कर्मी', 'icon' => 'cleaner-icon.png'],
        ['id' => 'cook', 'name' => 'Cook', 'name_hindi' => 'रसोइया', 'icon' => 'cook-icon.png'],
        ['id' => 'gardener', 'name' => 'Gardener', 'name_hindi' => 'माली', 'icon' => 'gardener-icon.png'],
        ['id' => 'security', 'name' => 'Security Guard', 'name_hindi' => 'सिक्योरिटी गार्ड', 'icon' => 'security-icon.png'],
        ['id' => 'welder', 'name' => 'Welder', 'name_hindi' => 'वेल्डर', 'icon' => 'welder-icon.png']
    ];
    
    // Try to get from database if available
    $pdo = getDBConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order, name");
            $stmt->execute();
            $db_categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (!empty($db_categories)) {
                $categories = array_merge([['id' => 'all', 'name' => 'All Categories', 'name_hindi' => 'सभी श्रेणियां', 'icon' => 'all-icon.png']], $db_categories);
            }
        } catch(PDOException $e) {
            // Use default categories if database fails
        }
    }
    
    sendJSON(['success' => true, 'data' => $categories]);
}
?>