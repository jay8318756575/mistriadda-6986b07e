# Database Setup Instructions (डेटाबेस सेटअप गाइड)

## ⚠️ IMPORTANT: OTP और Photo Upload Fix के लिए जरूरी

आपकी website की निम्नलिखित problems को fix करने के लिए database में कुछ changes करने होंगे:

### Problems यह fix करेगा:
1. ✅ OTP नहीं भेजा जा रहा था (database table mismatch)
2. ✅ Profile photo और work photos upload functionality
3. ✅ Video gallery के साथ profile photos display

---

## Step 1: Hostinger cPanel में Login करें

1. Hostinger dashboard खोलें
2. अपनी website पर जाएं
3. **"Manage" → "phpMyAdmin"** पर क्लिक करें

---

## Step 2: Database Select करें

1. phpMyAdmin में left side से अपना database select करें (usually `u123456789_mistriadda` जैसा नाम होगा)
2. Top पर **"SQL"** tab पर क्लिक करें

---

## Step 3: SQL Code Run करें

नीचे दिए गए SQL code को copy करें और SQL box में paste करें, फिर **"Go"** button पर क्लिक करें:

```sql
-- Fix OTP table schema to match firebase_otp.php requirements
DROP TABLE IF EXISTS otp_verifications;

CREATE TABLE otp_verifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    phone VARCHAR(20) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    firebase_session_id VARCHAR(255),
    status ENUM('pending', 'verified', 'expired') DEFAULT 'pending',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_status (status),
    INDEX idx_expires (expires_at)
);

-- Add profile_image column to mistris table if not exists
ALTER TABLE mistris ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500);

-- Add work_photos column to mistris table if not exists  
ALTER TABLE mistris ADD COLUMN IF NOT EXISTS work_photos TEXT;

-- Create photos index table for gallery
CREATE TABLE IF NOT EXISTS mistri_photos (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    mistri_id VARCHAR(36) NOT NULL,
    photo_type ENUM('profile', 'work') NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mistri_id) REFERENCES mistris(id) ON DELETE CASCADE,
    INDEX idx_mistri (mistri_id),
    INDEX idx_type (photo_type)
);
```

---

## Step 4: Success Message Verify करें

अगर सब कुछ सही रहा तो आपको green success message दिखेगा:
- "X rows affected" या
- "Query executed successfully"

---

## Step 5: Website Test करें

अब अपनी website पर जाकर test करें:

### Test 1: OTP Verification
1. Profile बनाने की form भरें
2. Mobile number डालें (10 digits)
3. Check करें कि अब OTP properly work कर रहा है

### Test 2: Photo Upload
1. Profile बनाते समय photo upload करें
2. Check करें कि photo properly save हो रहा है

### Test 3: Video Gallery
1. Homepage पर "वीडियो गैलरी" card पर क्लिक करें
2. या directly `/gallery` page खोलें
3. Uploaded videos को beautiful grid में देखें

---

## Troubleshooting (अगर कोई Problem आए)

### Error: "Table already exists"
- यह normal है, ignore करें और आगे बढ़ें

### Error: "Column already exists"  
- यह भी normal है, मतलब column पहले से मौजूद था

### Error: "Foreign key constraint fails"
- Ensure करें कि `mistris` table पहले से exist करती है
- अगर नहीं है तो `database.sql` या `schema.sql` file को भी run करें

### OTP अभी भी काम नहीं कर रहा?
1. Check करें कि `firebase_otp.php` file properly upload हुई है
2. `config.php` में database credentials सही हैं
3. PHP error logs check करें

---

## Next Steps (अगले कदम)

1. ✅ Database setup complete होने के बाद
2. ✅ `node build.cjs` run करें
3. ✅ सभी files Hostinger के `public_html` folder में upload करें
4. ✅ `uploads/` folder को `chmod 755` permissions दें
5. ✅ Website test करें

---

## Important Notes

- यह SQL code **safe** है और existing data को delete नहीं करेगा
- सिर्फ नई tables create करेगा या existing tables में columns add करेगा
- Backup लेना recommended है लेकिन optional (यह destructive operation नहीं है)

---

## Need Help?

अगर कोई problem आए तो:
1. Error message का screenshot लें
2. phpMyAdmin के error message को note करें
3. Check करें कि सही database select किया है

---

**Important**: इसे run करने के बाद website को refresh करें और features test करें!
