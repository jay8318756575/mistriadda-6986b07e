# Mistri Adda - Complete Service Platform

A complete web platform connecting customers with skilled workers (mistris) and drivers. Built with React frontend and PHP backend, ready for Hostinger deployment.

## 🚀 Quick Start for Hostinger

1. **Download the complete project** (all files are ready)
2. **Create MySQL database** in Hostinger cPanel
3. **Import schema.sql** using phpMyAdmin
4. **Update config.php** with your database credentials
5. **Upload all files** to public_html
6. **Set folder permissions** (uploads/ folder needs 755)

## ✨ Features

### 🔐 Complete Authentication System
- Secure signup/login with bcrypt password hashing
- Firebase OTP phone verification
- JWT token-based authentication
- Session management

### 👥 Multi-User Support
- **Customers**: Browse and book services
- **Mistris**: Service providers with skills showcase
- **Drivers**: Transportation services with license verification

### 📱 Core Features
- Video upload and streaming
- Location-based service discovery
- Profile management with photo/video
- Responsive design for mobile/desktop
- Real-time backend integration

## 📁 Project Structure

```
mistri-adda/
├── 📊 schema.sql              # Complete database setup
├── 🔐 auth.php               # Authentication system
├── 📱 firebase_otp.php       # OTP verification
├── 🚗 driver_register.php    # Driver registration
├── 👤 customer_register.php  # Customer registration
├── ⚙️ config.php             # Database configuration
├── 📡 api.php                # API endpoints
├── 📤 upload.php             # File upload handler
├── 🔧 .htaccess              # Apache configuration
├── src/pages/                # React pages
│   ├── Login.tsx             # User login
│   ├── Signup.tsx            # User registration
│   ├── VerifyOTP.tsx         # Phone verification
│   ├── Dashboard.tsx         # User dashboard
│   ├── DriverRegister.tsx    # Driver registration form
│   └── CustomerRegister.tsx  # Customer registration form
└── 📚 README.md              # This guide
```

## 🗄️ Database Tables

- **users**: Authentication and basic info
- **otp_verifications**: Phone verification
- **profiles**: User profiles with photos/videos
- **drivers**: Driver-specific info with license
- **mistris**: Service provider details
- **videos**: User-uploaded content
- **jobs**: Service bookings
- **reviews**: Rating system

## 🔧 Configuration

### Database Setup (config.php)
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
```

### Firebase OTP (Optional)
Update `firebase_otp.php` with your Firebase credentials for production OTP.

## 📋 Deployment Checklist

- ✅ MySQL database created
- ✅ schema.sql imported
- ✅ config.php updated
- ✅ Files uploaded to public_html
- ✅ uploads/ folder permissions set (755)
- ✅ SSL certificate enabled
- ✅ Test login/signup functionality

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- File upload validation
- SQL injection prevention
- XSS protection headers
- CORS configuration

## 📱 User Journey

1. **Signup** → Phone verification → Complete profile
2. **Login** → Dashboard with user-specific features
3. **Upload videos** → Showcase skills/work
4. **Browse services** → Location-based discovery
5. **Book services** → Job management system

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: PHP 7.4+, MySQL
- **Authentication**: JWT, bcrypt
- **File Upload**: Secure handling with validation
- **Deployment**: Hostinger-ready configuration

## 📞 Support

This is a complete, production-ready platform. All features are implemented and tested. Simply follow the deployment steps to get your Mistri Adda platform live!

---

**🎯 Ready for Production**: Upload and go live in minutes!