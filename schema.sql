-- Mistri Adda Database Schema
-- Run this SQL file in your Hostinger MySQL database

CREATE DATABASE IF NOT EXISTS mistri_adda;
USE mistri_adda;

-- Users table for authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('customer', 'driver', 'mistri') DEFAULT 'customer',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- OTP verification table
CREATE TABLE otp_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    firebase_session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    status ENUM('pending', 'verified', 'expired') DEFAULT 'pending',
    attempts INT DEFAULT 0
);

-- User profiles table
CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    profile_pic VARCHAR(500),
    video VARCHAR(500),
    bio TEXT,
    location VARCHAR(255),
    category VARCHAR(100),
    experience_years INT DEFAULT 0,
    hourly_rate DECIMAL(10,2) DEFAULT 0.00,
    is_available BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_jobs INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Drivers table for specific driver information
CREATE TABLE drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_image VARCHAR(500),
    vehicle_type VARCHAR(100),
    vehicle_number VARCHAR(50),
    vehicle_image VARCHAR(500),
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Mistris table (skilled workers)
CREATE TABLE mistris (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    skills TEXT,
    certifications TEXT,
    tools_owned TEXT,
    work_area_radius INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Videos table for user uploaded videos
CREATE TABLE videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    category VARCHAR(100),
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Jobs/Bookings table
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    mistri_id INT,
    driver_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    budget DECIMAL(10,2),
    status ENUM('pending', 'accepted', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    scheduled_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (mistri_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Reviews table
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    reviewed_user_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_otp_phone ON otp_verifications(phone);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_drivers_user_id ON drivers(user_id);
CREATE INDEX idx_mistris_user_id ON mistris(user_id);
CREATE INDEX idx_videos_user_id ON videos(user_id);
CREATE INDEX idx_jobs_customer_id ON jobs(customer_id);
CREATE INDEX idx_jobs_mistri_id ON jobs(mistri_id);
CREATE INDEX idx_jobs_status ON jobs(status);

-- Insert sample categories
INSERT INTO mistris (user_id, category, skills) VALUES 
(1, 'plumber', 'Pipe fitting, leak repair, bathroom installation'),
(2, 'electrician', 'Wiring, electrical repairs, appliance installation'),
(3, 'carpenter', 'Furniture making, wood work, door installation'),
(4, 'painter', 'Wall painting, texture work, interior design'),
(5, 'mechanic', 'Vehicle repair, maintenance, diagnostics');