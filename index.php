<?php
// Hostinger deployment configuration
// This file serves the React app and provides PHP backend capabilities

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set content type
header('Content-Type: text/html; charset=UTF-8');

// Check if this is an API request
if (isset($_GET['api'])) {
    // Handle API requests here
    header('Content-Type: application/json');
    
    switch ($_GET['api']) {
        case 'health':
            echo json_encode(['status' => 'ok', 'message' => 'PHP backend is working']);
            break;
            
        case 'contact':
            if ($_POST) {
                // Handle contact form submissions
                $name = $_POST['name'] ?? '';
                $phone = $_POST['phone'] ?? '';
                $message = $_POST['message'] ?? '';
                
                // You can add email functionality or database operations here
                echo json_encode([
                    'success' => true, 
                    'message' => 'संदेश प्राप्त हो गया'
                ]);
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'API endpoint not found']);
    }
    exit;
}

// Serve the React app
?>
<!DOCTYPE html>
<html lang="hi" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Primary SEO Tags -->
    <title>MistriAdda - सभी मिस्त्री एक ही जगह | Plumber, Electrician, Carpenter</title>
    <meta name="description" content="MistriAdda पर पाएं सभी प्रकार के विश्वसनीय मिस्त्री - प्लंबर, इलेक्ट्रिशियन, कारपेंटर, पेंटर और अन्य। घर बैठे बुक करें, वीडियो देखें और रेटिंग चेक करें।" />
    <meta name="keywords" content="मिस्त्री, plumber, electrician, carpenter, painter, mechanic, AC repair, home services, घर की मरम्मत, सर्विस" />
    <meta name="author" content="MistriAdda" />
    <meta name="robots" content="index, follow" />
    <meta name="language" content="Hindi" />
    <meta name="revisit-after" content="7 days" />
    
    <!-- Geo Tags -->
    <meta name="geo.region" content="IN" />
    <meta name="geo.country" content="India" />
    <meta name="geo.placename" content="India" />
    
    <!-- Open Graph Tags -->
    <meta property="og:title" content="MistriAdda - सभी मिस्त्री एक ही जगह | विश्वसनीय होम सर्विसेज" />
    <meta property="og:description" content="घर की सभी समस्याओं का समाधान। प्लंबर, इलेक्ट्रिशियन, कारपेंटर और अन्य मिस्त्री। तुरंत बुकिंग, वीडियो देखें, रेटिंग चेक करें।" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://<?php echo $_SERVER['HTTP_HOST']; ?>" />
    <meta property="og:image" content="https://<?php echo $_SERVER['HTTP_HOST']; ?>/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="hi_IN" />
    <meta property="og:site_name" content="MistriAdda" />
    
    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="MistriAdda - सभी मिस्त्री एक ही जगह" />
    <meta name="twitter:description" content="विश्वसनीय मिस्त्री सेवाएं - प्लंबर, इलेक्ट्रिशियन, कारपेंटर। घर बैठे बुकिंग करें।" />
    <meta name="twitter:image" content="https://<?php echo $_SERVER['HTTP_HOST']; ?>/twitter-image.jpg" />
    <meta name="twitter:site" content="@mistriadda" />
    
    <!-- Additional SEO -->
    <link rel="canonical" href="https://<?php echo $_SERVER['HTTP_HOST']; ?>" />
    <meta name="theme-color" content="#f97316" />
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "MistriAdda",
      "description": "विश्वसनीय मिस्त्री सेवाएं - प्लंबर, इलेक्ट्रिशियन, कारपेंटर और अन्य होम सर्विसेज",
      "url": "https://<?php echo $_SERVER['HTTP_HOST']; ?>",
      "telephone": "+91-XXXXXXXXXX",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressRegion": "India"
      },
      "serviceArea": {
        "@type": "Country",
        "name": "India"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "मिस्त्री सेवाएं",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "प्लंबिंग सेवा",
              "description": "पानी की पाइप, नल, बाथरूम की मरम्मत"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "इलेक्ट्रिकल सेवा",
              "description": "बिजली की समस्या, वायरिंग, फैन स्विच की मरम्मत"
            }
          }
        ]
      }
    }
    </script>
    
    <!-- Static CSS for better compatibility -->
    <style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        min-height: 100vh;
        margin: 0;
        padding: 0;
    }
    
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }
    
    .header {
        background: rgba(255, 255, 255, 0.1);
        padding: 20px;
        border-radius: 15px;
        margin-bottom: 30px;
        backdrop-filter: blur(10px);
        text-align: center;
    }
    
    .header h1 {
        color: white;
        font-size: 2.5rem;
        margin-bottom: 10px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .header p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.2rem;
    }
    
    .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
        margin: 30px 0;
    }
    
    .category-card {
        background: white;
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        text-align: center;
    }
    
    .category-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }
    
    .category-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 20px;
        background: #f97316;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        color: white;
    }
    
    .category-card h3 {
        font-size: 1.5rem;
        margin-bottom: 10px;
        color: #333;
    }
    
    .category-card p {
        color: #666;
        margin-bottom: 20px;
    }
    
    .btn {
        background: #f97316;
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        transition: background 0.3s ease;
        text-decoration: none;
        display: inline-block;
    }
    
    .btn:hover {
        background: #ea580c;
    }
    
    .action-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin: 40px 0;
        flex-wrap: wrap;
    }
    
    .form-container {
        background: white;
        padding: 30px;
        border-radius: 15px;
        margin: 20px 0;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        display: none;
    }
    
    .form-container.active {
        display: block;
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
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #f97316;
    }
    
    .success-message {
        background: #10b981;
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
        display: none;
    }
    
    .error-message {
        background: #ef4444;
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
        display: none;
    }
    
    @media (max-width: 768px) {
        .header h1 {
            font-size: 2rem;
        }
        
        .categories-grid {
            grid-template-columns: 1fr;
        }
        
        .action-buttons {
            flex-direction: column;
            align-items: center;
        }
    }
    </style>
  </head>

  <body>
    <div class="container">
        <!-- Header Section -->
        <div class="header">
            <h1>🔧 MistriAdda</h1>
            <p>सभी मिस्त्री एक ही जगह - विश्वसनीय होम सर्विसेज</p>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
            <button class="btn" onclick="showForm('mistri')">मिस्त्री प्रोफाइल बनाएं</button>
            <button class="btn" onclick="showForm('customer')">कस्टमर रजिस्टर करें</button>
            <button class="btn" onclick="showForm('video')">वीडियो अपलोड करें</button>
        </div>

        <!-- Success/Error Messages -->
        <div id="successMessage" class="success-message"></div>
        <div id="errorMessage" class="error-message"></div>

        <!-- Mistri Registration Form -->
        <div id="mistriForm" class="form-container">
            <h2>मिस्त्री प्रोफाइल बनाएं</h2>
            <form id="mistriProfileForm" onsubmit="submitMistriProfile(event)">
                <div class="form-group">
                    <label for="mistriName">नाम *</label>
                    <input type="text" id="mistriName" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="mistriPhone">मोबाइल नंबर *</label>
                    <input type="tel" id="mistriPhone" name="phone" required pattern="[0-9]{10}">
                </div>
                
                <div class="form-group">
                    <label for="mistriCategory">काम का प्रकार *</label>
                    <select id="mistriCategory" name="category" required>
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
                    <label for="mistriLocation">लोकेशन *</label>
                    <input type="text" id="mistriLocation" name="location" required>
                </div>
                
                <div class="form-group">
                    <label for="mistriExperience">अनुभव (साल में)</label>
                    <input type="number" id="mistriExperience" name="experience" min="0" max="50">
                </div>
                
                <div class="form-group">
                    <label for="mistriDescription">अपने बारे में बताएं</label>
                    <textarea id="mistriDescription" name="description" rows="4"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="mistriProfile">प्रोफाइल फोटो</label>
                    <input type="file" id="mistriProfile" name="profile_image" accept="image/*">
                </div>
                
                <button type="submit" class="btn">प्रोफाइल बनाएं</button>
            </form>
        </div>

        <!-- Customer Registration Form -->
        <div id="customerForm" class="form-container">
            <h2>कस्टमर रजिस्ट्रेशन</h2>
            <form id="customerRegForm" onsubmit="submitCustomerReg(event)">
                <div class="form-group">
                    <label for="customerName">नाम *</label>
                    <input type="text" id="customerName" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="customerPhone">मोबाइल नंबर *</label>
                    <input type="tel" id="customerPhone" name="phone" required pattern="[0-9]{10}">
                </div>
                
                <div class="form-group">
                    <label for="customerLocation">लोकेशन *</label>
                    <input type="text" id="customerLocation" name="location" required>
                </div>
                
                <button type="submit" class="btn">रजिस्टर करें</button>
            </form>
        </div>

        <!-- Video Upload Form -->
        <div id="videoForm" class="form-container">
            <h2>वीडियो अपलोड करें</h2>
            <form id="videoUploadForm" onsubmit="submitVideo(event)">
                <div class="form-group">
                    <label for="videoTitle">वीडियो का टाइटल *</label>
                    <input type="text" id="videoTitle" name="title" required>
                </div>
                
                <div class="form-group">
                    <label for="videoDesc">वीडियो का विवरण</label>
                    <textarea id="videoDesc" name="description" rows="3"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="videoFile">वीडियो फाइल *</label>
                    <input type="file" id="videoFile" name="video" accept="video/*" required>
                </div>
                
                <div class="form-group">
                    <label for="videoMistri">मिस्त्री फोन नंबर *</label>
                    <input type="tel" id="videoMistri" name="mistri_phone" required>
                </div>
                
                <button type="submit" class="btn">वीडियो अपलोड करें</button>
            </form>
        </div>

        <!-- Categories Display -->
        <div class="categories-grid">
            <div class="category-card">
                <div class="category-icon">🔧</div>
                <h3>प्लंबर</h3>
                <p>पानी की पाइप, नल, बाथरूम की समस्या</p>
                <a href="#" class="btn">देखें</a>
            </div>
            
            <div class="category-card">
                <div class="category-icon">⚡</div>
                <h3>इलेक्ट्रिशियन</h3>
                <p>बिजली की समस्या, वायरिंग, फैन स्विच</p>
                <a href="#" class="btn">देखें</a>
            </div>
            
            <div class="category-card">
                <div class="category-icon">🔨</div>
                <h3>कारपेंटर</h3>
                <p>लकड़ी का काम, फर्नीचर, दरवाजे खिड़की</p>
                <a href="#" class="btn">देखें</a>
            </div>
            
            <div class="category-card">
                <div class="category-icon">🎨</div>
                <h3>पेंटर</h3>
                <p>दीवार की पेंटिंग, रंगाई पुताई का काम</p>
                <a href="#" class="btn">देखें</a>
            </div>
        </div>
    </div>

    <script>
    // Form handling functions
    function showForm(type) {
        // Hide all forms
        document.querySelectorAll('.form-container').forEach(form => {
            form.classList.remove('active');
        });
        
        // Show selected form
        if (type === 'mistri') {
            document.getElementById('mistriForm').classList.add('active');
        } else if (type === 'customer') {
            document.getElementById('customerForm').classList.add('active');
        } else if (type === 'video') {
            document.getElementById('videoForm').classList.add('active');
        }
    }

    function showMessage(type, message) {
        const successEl = document.getElementById('successMessage');
        const errorEl = document.getElementById('errorMessage');
        
        if (type === 'success') {
            successEl.textContent = message;
            successEl.style.display = 'block';
            errorEl.style.display = 'none';
        } else {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
            successEl.style.display = 'none';
        }
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            successEl.style.display = 'none';
            errorEl.style.display = 'none';
        }, 5000);
    }

    // Submit mistri profile
    async function submitMistriProfile(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        formData.append('action', 'save_profile');
        
        try {
            const response = await fetch('save_profile.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                showMessage('success', 'प्रोफाइल सफलतापूर्वक बन गई!');
                event.target.reset();
            } else {
                showMessage('error', result.message || 'कुछ गलत हुआ है');
            }
        } catch (error) {
            showMessage('error', 'नेटवर्क एरर: ' + error.message);
        }
    }

    // Submit customer registration
    async function submitCustomerReg(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        formData.append('action', 'customer_register');
        
        try {
            const response = await fetch('customer_register.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                showMessage('success', 'कस्टमर रजिस्ट्रेशन सफल!');
                event.target.reset();
            } else {
                showMessage('error', result.message || 'कुछ गलत हुआ है');
            }
        } catch (error) {
            showMessage('error', 'नेटवर्क एरर: ' + error.message);
        }
    }

    // Submit video upload
    async function submitVideo(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        
        try {
            const response = await fetch('upload_video.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                showMessage('success', 'वीडियो सफलतापूर्वक अपलोड हो गई!');
                event.target.reset();
            } else {
                showMessage('error', result.message || 'कुछ गलत हुआ है');
            }
        } catch (error) {
            showMessage('error', 'वीडियो अपलोड में समस्या: ' + error.message);
        }
    }
    </script>
    
    <!-- PHP Backend Integration with Error Handling -->
    <script>
    // Add PHP backend integration with better error handling
    window.phpBackend = {
        apiUrl: '<?php echo $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST']; ?>',
        
        callAPI: async function(endpoint, data = {}) {
            try {
                const formData = new FormData();
                Object.keys(data).forEach(key => {
                    formData.append(key, data[key]);
                });
                
                const response = await fetch(`${this.apiUrl}/?api=${endpoint}`, {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                return result;
            } catch (error) {
                console.error('PHP Backend API Error:', error);
                // Return user-friendly error messages
                if (error.message.includes('fetch') || error.message.includes('Network')) {
                    throw new Error('नेटवर्क कनेक्शन में समस्या। कृपया इंटरनेट कनेक्शन चेक करें।');
                }
                throw error;
            }
        },
        
        // Health check function
        checkHealth: async function() {
            try {
                const result = await this.callAPI('health', {});
                return result && result.status === 'ok';
            } catch (error) {
                console.warn('Backend health check failed:', error);
                return false;
            }
        }
    };
    
    // Perform initial health check when page loads
    document.addEventListener('DOMContentLoaded', function() {
        window.phpBackend.checkHealth().then(function(isHealthy) {
            if (isHealthy) {
                console.log('✅ PHP Backend is healthy');
            } else {
                console.warn('⚠️ PHP Backend health check failed');
            }
        }).catch(function(error) {
            console.warn('❌ Backend health check error:', error);
        });
    });
    </script>
  </body>
</html>