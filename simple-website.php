<?php
// Simple PHP website for Hostinger - No React, Pure PHP
require_once 'config.php';

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    switch($action) {
        case 'save_profile':
            $result = saveMistriProfile($_POST, $_FILES);
            break;
        case 'customer_register':
            $result = saveCustomer($_POST);
            break;
        case 'upload_video':
            $result = uploadVideo($_POST, $_FILES);
            break;
        default:
            $result = ['success' => false, 'message' => 'Invalid action'];
    }
    
    if (isset($_POST['ajax'])) {
        header('Content-Type: application/json');
        echo json_encode($result);
        exit;
    }
}

function saveMistriProfile($data, $files) {
    try {
        $pdo = getDBConnection();
        if (!$pdo) {
            return ['success' => false, 'message' => 'Database connection failed'];
        }
        
        $profileImage = '';
        if (isset($files['profile_image']) && $files['profile_image']['error'] === 0) {
            $uploadDir = 'uploads/profiles/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
            
            $extension = pathinfo($files['profile_image']['name'], PATHINFO_EXTENSION);
            $filename = uniqid() . '.' . $extension;
            $filepath = $uploadDir . $filename;
            
            if (move_uploaded_file($files['profile_image']['tmp_name'], $filepath)) {
                $profileImage = $filepath;
            }
        }
        
        $stmt = $pdo->prepare("INSERT INTO mistris (id, name, phone, location, category, experience_years, description, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            generateUUID(),
            $data['name'],
            $data['phone'],
            $data['location'],
            $data['category'],
            $data['experience'] ?? 0,
            $data['description'] ?? '',
            $profileImage
        ]);
        
        return ['success' => true, 'message' => 'Profile saved successfully'];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
}

function saveCustomer($data) {
    try {
        $pdo = getDBConnection();
        if (!$pdo) {
            return ['success' => false, 'message' => 'Database connection failed'];
        }
        
        $stmt = $pdo->prepare("INSERT INTO customers (id, name, phone, location, created_at) VALUES (?, ?, ?, ?, NOW())");
        $stmt->execute([
            generateUUID(),
            $data['name'],
            $data['phone'],
            $data['location']
        ]);
        
        return ['success' => true, 'message' => 'Customer registered successfully'];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
}

function uploadVideo($data, $files) {
    try {
        $pdo = getDBConnection();
        if (!$pdo) {
            return ['success' => false, 'message' => 'Database connection failed'];
        }
        
        $videoUrl = '';
        if (isset($files['video']) && $files['video']['error'] === 0) {
            $uploadDir = 'uploads/videos/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
            
            $extension = pathinfo($files['video']['name'], PATHINFO_EXTENSION);
            $filename = uniqid() . '.' . $extension;
            $filepath = $uploadDir . $filename;
            
            if (move_uploaded_file($files['video']['tmp_name'], $filepath)) {
                $videoUrl = $filepath;
            }
        }
        
        // Find mistri by phone
        $stmt = $pdo->prepare("SELECT id FROM mistris WHERE phone = ?");
        $stmt->execute([$data['mistri_phone']]);
        $mistri = $stmt->fetch();
        
        if (!$mistri) {
            return ['success' => false, 'message' => 'Mistri not found with this phone number'];
        }
        
        $stmt = $pdo->prepare("INSERT INTO mistri_videos (id, mistri_id, title, description, video_url) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            generateUUID(),
            $mistri['id'],
            $data['title'],
            $data['description'] ?? '',
            $videoUrl
        ]);
        
        return ['success' => true, 'message' => 'Video uploaded successfully'];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
}

// Get all mistris for display
function getAllMistris() {
    try {
        $pdo = getDBConnection();
        if (!$pdo) return [];
        
        $stmt = $pdo->query("SELECT * FROM mistris ORDER BY created_at DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        return [];
    }
}
?>
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MistriAdda - मिस्त्री सेवाएं</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            background-attachment: fixed;
            min-height: 100vh;
            color: #333;
            margin: 0;
            padding: 0;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: rgba(255, 255, 255, 0.15);
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            margin-bottom: 30px;
            backdrop-filter: blur(15px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .header h1 {
            color: white;
            font-size: 3rem;
            margin-bottom: 15px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header p {
            color: rgba(255, 255, 255, 0.95);
            font-size: 1.3rem;
        }
        
        .nav-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin: 30px 0;
            flex-wrap: wrap;
        }
        
        .btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 15px 25px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 10px;
            cursor: pointer;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            backdrop-filter: blur(10px);
        }
        
        .btn:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
        }
        
        .btn.active {
            background: white;
            color: #f97316;
            border-color: white;
        }
        
        .content-section {
            background: white;
            padding: 30px;
            border-radius: 20px;
            margin: 20px 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            display: none;
        }
        
        .content-section.active {
            display: block;
        }
        
        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #f97316;
        }
        
        .submit-btn {
            background: #f97316;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 1.1rem;
            transition: background 0.3s ease;
            width: 100%;
        }
        
        .submit-btn:hover {
            background: #ea580c;
        }
        
        .message {
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            display: none;
        }
        
        .success {
            background: #10b981;
            color: white;
        }
        
        .error {
            background: #ef4444;
            color: white;
        }
        
        .mistri-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .mistri-card {
            background: #f8fafc;
            padding: 25px;
            border-radius: 15px;
            border-left: 5px solid #f97316;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }
        
        .mistri-card h3 {
            color: #f97316;
            margin-bottom: 10px;
        }
        
        .mistri-card p {
            margin: 5px 0;
            color: #666;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .nav-buttons {
                flex-direction: column;
                align-items: center;
            }
            
            .form-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔧 MistriAdda</h1>
            <p>सभी मिस्त्री एक ही जगह - विश्वसनीय होम सर्विसेज</p>
        </div>

        <div class="nav-buttons">
            <button class="btn active" onclick="showSection('home')">होम</button>
            <button class="btn" onclick="showSection('mistri')">मिस्त्री प्रोफाइल</button>
            <button class="btn" onclick="showSection('customer')">कस्टमर रजिस्टर</button>
            <button class="btn" onclick="showSection('video')">वीडियो अपलोड</button>
            <button class="btn" onclick="showSection('view')">सभी मिस्त्री देखें</button>
        </div>

        <div id="message" class="message"></div>

        <!-- Home Section -->
        <div id="home" class="content-section active">
            <h2>स्वागत है MistriAdda में</h2>
            <p>यहाँ आप सभी प्रकार की होम सर्विसेज पा सकते हैं। मिस्त्री अपनी प्रोफाइल बना सकते हैं और कस्टमर आसानी से सर्विस बुक कर सकते हैं।</p>
            
            <div class="mistri-grid">
                <div class="mistri-card">
                    <h3>🔧 प्लंबर सेवा</h3>
                    <p>पानी की पाइप, नल, बाथरूम की समस्या का समाधान</p>
                </div>
                <div class="mistri-card">
                    <h3>⚡ इलेक्ट्रिकल सेवा</h3>
                    <p>बिजली की समस्या, वायरिंग, फैन स्विच की मरम्मत</p>
                </div>
                <div class="mistri-card">
                    <h3>🔨 कारपेंटर सेवा</h3>
                    <p>लकड़ी का काम, फर्नीचर बनाना और मरम्मत</p>
                </div>
                <div class="mistri-card">
                    <h3>🎨 पेंटर सेवा</h3>
                    <p>दीवार की पेंटिंग, रंगाई पुताई का काम</p>
                </div>
            </div>
        </div>

        <!-- Mistri Profile Section -->
        <div id="mistri" class="content-section">
            <h2>मिस्त्री प्रोफाइल बनाएं</h2>
            <form id="mistriForm" method="POST" enctype="multipart/form-data">
                <input type="hidden" name="action" value="save_profile">
                <input type="hidden" name="ajax" value="1">
                
                <div class="form-grid">
                    <div class="form-group">
                        <label for="name">नाम *</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">मोबाइल नंबर *</label>
                        <input type="tel" id="phone" name="phone" required pattern="[0-9]{10}">
                    </div>
                    
                    <div class="form-group">
                        <label for="category">काम का प्रकार *</label>
                        <select id="category" name="category" required>
                            <option value="">चुनें</option>
                            <option value="plumber">प्लंबर</option>
                            <option value="electrician">इलेक्ट्रिशियन</option>
                            <option value="carpenter">कारपेंटर</option>
                            <option value="painter">पेंटर</option>
                            <option value="mechanic">मैकेनिक</option>
                            <option value="cleaner">क्लीनर</option>
                            <option value="cook">रसोइया</option>
                            <option value="security">सिक्योरिटी</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="location">लोकेशन *</label>
                        <input type="text" id="location" name="location" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="experience">अनुभव (साल में)</label>
                        <input type="number" id="experience" name="experience" min="0" max="50">
                    </div>
                    
                    <div class="form-group">
                        <label for="profile_image">प्रोफाइल फोटो</label>
                        <input type="file" id="profile_image" name="profile_image" accept="image/*">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="description">अपने बारे में बताएं</label>
                    <textarea id="description" name="description" rows="4"></textarea>
                </div>
                
                <button type="submit" class="submit-btn">प्रोफाइल बनाएं</button>
            </form>
        </div>

        <!-- Customer Registration Section -->
        <div id="customer" class="content-section">
            <h2>कस्टमर रजिस्ट्रेशन</h2>
            <form id="customerForm" method="POST">
                <input type="hidden" name="action" value="customer_register">
                <input type="hidden" name="ajax" value="1">
                
                <div class="form-grid">
                    <div class="form-group">
                        <label for="cust_name">नाम *</label>
                        <input type="text" id="cust_name" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="cust_phone">मोबाइल नंबर *</label>
                        <input type="tel" id="cust_phone" name="phone" required pattern="[0-9]{10}">
                    </div>
                    
                    <div class="form-group">
                        <label for="cust_location">लोकेशन *</label>
                        <input type="text" id="cust_location" name="location" required>
                    </div>
                </div>
                
                <button type="submit" class="submit-btn">रजिस्टर करें</button>
            </form>
        </div>

        <!-- Video Upload Section -->
        <div id="video" class="content-section">
            <h2>वीडियो अपलोड करें</h2>
            <form id="videoForm" method="POST" enctype="multipart/form-data">
                <input type="hidden" name="action" value="upload_video">
                <input type="hidden" name="ajax" value="1">
                
                <div class="form-grid">
                    <div class="form-group">
                        <label for="title">वीडियो का टाइटल *</label>
                        <input type="text" id="title" name="title" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="mistri_phone">मिस्त्री फोन नंबर *</label>
                        <input type="tel" id="mistri_phone" name="mistri_phone" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="video">वीडियो फाइल *</label>
                        <input type="file" id="video" name="video" accept="video/*" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="video_description">वीडियो का विवरण</label>
                    <textarea id="video_description" name="description" rows="3"></textarea>
                </div>
                
                <button type="submit" class="submit-btn">वीडियो अपलोड करें</button>
            </form>
        </div>

        <!-- View All Mistris Section -->
        <div id="view" class="content-section">
            <h2>सभी मिस्त्री</h2>
            <div class="mistri-grid">
                <?php
                $mistris = getAllMistris();
                if (empty($mistris)) {
                    echo '<p>अभी तक कोई मिस्त्री रजिस्टर नहीं हुआ है।</p>';
                } else {
                    foreach ($mistris as $mistri) {
                        echo '<div class="mistri-card">';
                        echo '<h3>' . htmlspecialchars($mistri['name']) . '</h3>';
                        echo '<p><strong>काम:</strong> ' . htmlspecialchars($mistri['category']) . '</p>';
                        echo '<p><strong>फोन:</strong> ' . htmlspecialchars($mistri['phone']) . '</p>';
                        echo '<p><strong>लोकेशन:</strong> ' . htmlspecialchars($mistri['location']) . '</p>';
                        if ($mistri['experience_years']) {
                            echo '<p><strong>अनुभव:</strong> ' . $mistri['experience_years'] . ' साल</p>';
                        }
                        if ($mistri['description']) {
                            echo '<p><strong>विवरण:</strong> ' . htmlspecialchars($mistri['description']) . '</p>';
                        }
                        echo '</div>';
                    }
                }
                ?>
            </div>
        </div>
    </div>

    <script>
        function showSection(sectionId) {
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Remove active class from all buttons
            document.querySelectorAll('.btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected section
            document.getElementById(sectionId).classList.add('active');
            
            // Add active class to clicked button
            event.target.classList.add('active');
        }

        function showMessage(type, text) {
            const messageEl = document.getElementById('message');
            messageEl.className = 'message ' + type;
            messageEl.textContent = text;
            messageEl.style.display = 'block';
            
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 5000);
        }

        // Handle form submissions
        document.getElementById('mistriForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            
            try {
                const response = await fetch('', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage('success', 'प्रोफाइल सफलतापूर्वक बन गई!');
                    this.reset();
                } else {
                    showMessage('error', result.message);
                }
            } catch (error) {
                showMessage('error', 'नेटवर्क एरर: ' + error.message);
            }
        });

        document.getElementById('customerForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            
            try {
                const response = await fetch('', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage('success', 'कस्टमर रजिस्ट्रेशन सफल!');
                    this.reset();
                } else {
                    showMessage('error', result.message);
                }
            } catch (error) {
                showMessage('error', 'नेटवर्क एरर: ' + error.message);
            }
        });

        document.getElementById('videoForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            
            try {
                const response = await fetch('', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage('success', 'वीडियो सफलतापूर्वक अपलोड हो गई!');
                    this.reset();
                } else {
                    showMessage('error', result.message);
                }
            } catch (error) {
                showMessage('error', 'वीडियो अपलोड में समस्या: ' + error.message);
            }
        });
    </script>
</body>
</html>