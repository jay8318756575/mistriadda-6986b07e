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
    
    <!-- Dynamic CSS and JS loading -->
    <?php
    // Check for Vite manifest first (production build)
    $manifestPath = __DIR__ . '/.vite/manifest.json';
    $entryFile = '';
    $imports = [];
    
    if (file_exists($manifestPath)) {
        // Production build with manifest
        $manifest = json_decode(file_get_contents($manifestPath), true);
        
        if (isset($manifest['index.html'])) {
            // Load CSS files
            if (isset($manifest['index.html']['css'])) {
                foreach ($manifest['index.html']['css'] as $cssFile) {
                    echo '<link rel="stylesheet" href="/' . $cssFile . '">' . "\n    ";
                }
            }
            
            // Set entry file
            if (isset($manifest['index.html']['file'])) {
                $entryFile = $manifest['index.html']['file'];
            }
            
            // Load imports
            if (isset($manifest['index.html']['imports'])) {
                $imports = $manifest['index.html']['imports'];
            }
        }
    } else {
        // Fallback: Check for built assets in assets directory
        $assetsDir = __DIR__ . '/assets/';
        
        if (is_dir($assetsDir)) {
            // Find CSS files
            $cssFiles = glob($assetsDir . '*.css');
            if (!empty($cssFiles)) {
                foreach ($cssFiles as $cssFile) {
                    $cssFile = basename($cssFile);
                    echo '<link rel="stylesheet" href="/assets/' . $cssFile . '">' . "\n    ";
                }
            }
            
            // Find JS files
            $jsFiles = glob($assetsDir . '*.js');
            if (!empty($jsFiles)) {
                foreach ($jsFiles as $jsFile) {
                    $jsFile = basename($jsFile);
                    if (strpos($jsFile, 'index') !== false) {
                        $entryFile = 'assets/' . $jsFile;
                    } else {
                        $imports[] = 'assets/' . $jsFile;
                    }
                }
            }
        }
    }
    ?>
  </head>

  <body>
    <div id="root"></div>
    
    <?php
    // Load JS files using entry/imports computed above
    if (!empty($entryFile)) {
        echo '<script type="module" src="/' . $entryFile . '"></script>' . "\n    ";
        foreach ($imports as $importFile) {
            echo '<script type="module" src="/' . $importFile . '"></script>' . "\n    ";
        }
    } else {
        // Fallback script loading
        echo '<script>console.log("No JS files found, checking if this is development mode...");</script>' . "\n    ";
    }
    ?>
    
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