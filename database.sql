-- MistriAdda Complete Database Schema
-- Run this SQL file in your Hostinger MySQL database

CREATE DATABASE IF NOT EXISTS mistriadda;
USE mistriadda;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
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
CREATE TABLE IF NOT EXISTS otp_verifications (
    id VARCHAR(36) PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_expires (expires_at)
);

-- Mistris table (skilled workers)
CREATE TABLE IF NOT EXISTS mistris (
    id VARCHAR(36) PRIMARY KEY,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    experience_years INT DEFAULT 0,
    description TEXT,
    profile_image VARCHAR(500),
    address TEXT,
    hourly_rate DECIMAL(10,2) DEFAULT 0.00,
    is_verified BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_jobs INT DEFAULT 0,
    skills TEXT,
    certifications TEXT,
    tools_owned TEXT,
    work_area_radius INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_phone (phone),
    INDEX idx_category (category),
    INDEX idx_location (location),
    INDEX idx_available (is_available)
);

-- Videos table for mistri uploaded videos
CREATE TABLE IF NOT EXISTS mistri_videos (
    id VARCHAR(36) PRIMARY KEY,
    mistri_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mistri_id) REFERENCES mistris(id) ON DELETE CASCADE,
    INDEX idx_mistri_id (mistri_id),
    INDEX idx_active (is_active),
    INDEX idx_featured (is_featured)
);

-- Drivers table for specific driver information
CREATE TABLE IF NOT EXISTS drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_image VARCHAR(500),
    vehicle_type VARCHAR(100),
    vehicle_number VARCHAR(50),
    vehicle_image VARCHAR(500),
    location VARCHAR(255),
    is_approved BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_rides INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_phone (phone),
    INDEX idx_license (license_number),
    INDEX idx_approved (is_approved),
    INDEX idx_available (is_available)
);

-- User profiles table
CREATE TABLE IF NOT EXISTS profiles (
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_category (category),
    INDEX idx_available (is_available)
);

-- Jobs/Bookings table
CREATE TABLE IF NOT EXISTS jobs (
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
    completed_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (mistri_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_customer_id (customer_id),
    INDEX idx_mistri_id (mistri_id),
    INDEX idx_driver_id (driver_id),
    INDEX idx_status (status)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    reviewed_user_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_job_id (job_id),
    INDEX idx_reviewer_id (reviewer_id),
    INDEX idx_reviewed_user_id (reviewed_user_id)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_hindi VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (id, name, name_hindi, description, icon, sort_order) VALUES
('plumber', 'Plumber', 'प्लंबर', 'Water pipe repairs, bathroom fittings, drainage', 'plumber-icon.png', 1),
('electrician', 'Electrician', 'इलेक्ट्रीशियन', 'Electrical repairs, wiring, appliance installation', 'electrician-icon.png', 2),
('carpenter', 'Carpenter', 'बढ़ई', 'Wood work, furniture making, door installation', 'carpenter-icon.png', 3),
('painter', 'Painter', 'पेंटर', 'Wall painting, interior decoration, texture work', 'painter-icon.png', 4),
('mason', 'Mason', 'राजमिस्त्री', 'Construction work, brick laying, plastering', 'mason-icon.png', 5),
('mechanic', 'Mechanic', 'मैकेनिक', 'Vehicle repair, maintenance, diagnostics', 'mechanic-icon.png', 6),
('pop_ceiling', 'POP Ceiling', 'POP छत', 'False ceiling, POP work, interior design', 'pop-ceiling-icon.png', 7),
('gypsum_board', 'Gypsum Board', 'जिप्सम बोर्ड', 'Gypsum board installation, partition walls', 'gypsum-board-icon.png', 8),
('kabadi', 'Scrap Dealer', 'कबाड़ी', 'Scrap collection, waste management, recycling', 'kabadi-icon.png', 9),
('driver', 'Driver', 'ड्राइवर', 'Transportation services, delivery, taxi', 'driver-icon.png', 10),
('cleaner', 'Cleaner', 'सफाई कर्मी', 'House cleaning, office cleaning, deep cleaning', 'cleaner-icon.png', 11),
('cook', 'Cook', 'रसोइया', 'Home cooking, catering, food preparation', 'cook-icon.png', 12),
('gardener', 'Gardener', 'माली', 'Garden maintenance, plant care, landscaping', 'gardener-icon.png', 13),
('security', 'Security Guard', 'सिक्योरिटी गार्ड', 'Security services, property protection', 'security-icon.png', 14),
('welder', 'Welder', 'वेल्डर', 'Metal welding, fabrication, repair work', 'welder-icon.png', 15)
ON DUPLICATE KEY UPDATE 
name = VALUES(name), 
name_hindi = VALUES(name_hindi), 
description = VALUES(description);

-- Sample mistris data
INSERT INTO mistris (id, name, phone, location, category, experience_years, description, hourly_rate, rating) VALUES
('mistri-001', 'राज शर्मा', '9876543210', 'लखनऊ, उत्तर प्रदेश', 'plumber', 5, 'अनुभवी प्लंबर, सभी प्रकार की पाइप और नल की समस्या का समाधान', 200.00, 4.5),
('mistri-002', 'सुरेश कुमार', '9876543211', 'कानपुर, उत्तर प्रदेश', 'electrician', 8, 'इलेक्ट्रिकल वायरिंग और रिपेयर के विशेषज्ञ', 250.00, 4.8),
('mistri-003', 'रमेश यादव', '9876543212', 'वाराणसी, उत्तर प्रदेश', 'carpenter', 10, 'लकड़ी का काम, फर्नीचर बनाना और रिपेयर', 300.00, 4.7),
('mistri-004', 'विकास गुप्ता', '9876543213', 'आगरा, उत्तर प्रदेश', 'painter', 6, 'घर की पेंटिंग और डेकोरेशन का काम', 180.00, 4.3),
('mistri-005', 'अनिल सिंह', '9876543214', 'मेरठ, उत्तर प्रदेश', 'mechanic', 12, 'गाड़ी की मरम्मत और मेंटेनेंस', 350.00, 4.9)
ON DUPLICATE KEY UPDATE 
name = VALUES(name), 
location = VALUES(location), 
experience_years = VALUES(experience_years);