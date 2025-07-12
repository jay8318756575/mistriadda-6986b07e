# 🚀 Hostinger Deployment Guide - MistriAdda

## 📋 Pre-Deployment Checklist

✅ **Files Created:**
- `index.php` - PHP backend with React app integration
- `build-for-hostinger.js` - Automated build script
- `README-HOSTINGER-DEPLOYMENT.md` - This guide

## 🛠️ Build Commands

### Option 1: Manual Build
```bash
npm run build
node build-for-hostinger.js
```

### Option 2: Direct Build Script
```bash
node build-for-hostinger.js
```

## 📁 File Structure After Build

```
dist/
├── index.php                 # Main PHP file (serves React + API)
├── index.html               # Static fallback
├── .htaccess                # Apache configuration
├── assets/                  # Built CSS/JS files
├── deployment-info.json     # Build information
└── DEPLOYMENT-INSTRUCTIONS.txt
```

## 🌐 Hostinger Upload Steps

1. **Prepare Files:**
   ```bash
   node build-for-hostinger.js
   cd dist
   ```

2. **Create ZIP:**
   - Select ALL files in `dist` folder
   - Create ZIP (don't include the dist folder itself)

3. **Upload to Hostinger:**
   - Login to Hostinger control panel
   - Go to **File Manager**
   - Navigate to `public_html`
   - Upload ZIP file
   - Extract in place
   - Delete ZIP file

4. **Verify Upload:**
   - Check `public_html` contains:
     - ✅ index.php
     - ✅ index.html  
     - ✅ .htaccess
     - ✅ assets/ folder

## 🔧 Features Included

### PHP Backend API
- **Health Check:** `yoursite.com/?api=health`
- **Contact Form:** `yoursite.com/?api=contact`
- **Extensible:** Add more API endpoints in index.php

### React Frontend
- ✅ Full SPA with routing
- ✅ Mobile responsive design
- ✅ Hindi/English support
- ✅ SEO optimized
- ✅ Supabase integration ready

### Server Configuration
- ✅ Apache .htaccess for routing
- ✅ Gzip compression enabled
- ✅ Cache headers optimized
- ✅ Security headers added

## 🐛 Troubleshooting

### Common Issues:

1. **White Screen After Upload:**
   - Check if all files uploaded correctly
   - Verify .htaccess is present
   - Check PHP error logs in Hostinger panel

2. **React Routes Not Working:**
   - Ensure .htaccess has proper rewrite rules
   - Check Apache mod_rewrite is enabled

3. **Assets Not Loading:**
   - Verify assets/ folder uploaded completely
   - Check file permissions (755 for folders, 644 for files)

4. **PHP Errors:**
   - Enable error reporting in Hostinger panel
   - Check PHP version compatibility (7.4+ recommended)

### Test URLs After Deployment:
- `https://yoursite.com/` - Main site
- `https://yoursite.com/?api=health` - PHP backend test
- `https://yoursite.com/videos` - React routing test

## 📞 Support

If you encounter issues:
1. Check `deployment-info.json` for build details
2. Review Hostinger error logs
3. Verify all files uploaded correctly
4. Test PHP backend separately

## 🔄 Updates

To update your site:
1. Make changes to source code
2. Run `node build-for-hostinger.js`
3. Upload new dist/ files to Hostinger
4. Clear any caches if needed

---

**Ready for deployment!** 🎉