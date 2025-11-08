-- Fix OTP table schema to match firebase_otp.php requirements
-- Run this SQL in your Hostinger phpMyAdmin

-- Drop old table if exists
DROP TABLE IF EXISTS otp_verifications;

-- Create correct OTP table
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
