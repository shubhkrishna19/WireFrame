# 🚀 Deployment Guide for srcry.in (Hostinger)

This guide will help you deploy your React e-commerce application to your Hostinger domain (srcry.in).

## Prerequisites

- Hostinger account with domain `srcry.in` configured
- Access to Hostinger File Manager or FTP
- Completed development build of the application

---

## Step 1: Build the Production Version

First, create an optimized production build of your application:

```bash
npm run build
```

This will create a `dist` folder containing all the optimized static files.

---

## Step 2: Prepare Files for Upload

After building, you'll have a `dist` folder with:
- `index.html` (main entry point)
- `assets/` folder (JavaScript, CSS, images)
- Other static files

**Important:** Make sure all files in the `dist` folder are ready to upload.

---

## Step 3: Access Hostinger File Manager

1. Log in to your **Hostinger account**
2. Go to **hPanel** (Hostinger Control Panel)
3. Navigate to **Files** → **File Manager**
4. Open your domain folder (`public_html` or `srcry.in`)

---

## Step 4: Upload Files

### Option A: Using File Manager (Recommended for first time)

1. **Clear existing files** (if any) in `public_html`:
   - Select all files
   - Delete them (keep a backup if needed)

2. **Upload the `dist` folder contents**:
   - Click **Upload** button
   - Select all files from your local `dist` folder
   - Wait for upload to complete

3. **Move files to root**:
   - If files uploaded to a subfolder, move `index.html` and `assets/` to `public_html/` root

### Option B: Using FTP (Faster for updates)

1. **Get FTP credentials** from Hostinger:
   - Go to **FTP Accounts** in hPanel
   - Note down: Host, Username, Password, Port

2. **Use FTP client** (FileZilla, WinSCP, etc.):
   ```
   Host: ftp.srcry.in (or IP provided)
   Username: [your-ftp-username]
   Password: [your-ftp-password]
   Port: 21
   ```

3. **Upload files**:
   - Connect to FTP
   - Navigate to `public_html/`
   - Upload all contents from `dist/` folder

---

## Step 5: Configure for React Router

Since you're using React Router, you need to handle client-side routing.

### Create `.htaccess` file

Create a file named `.htaccess` in `public_html/` with this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

This ensures all routes are handled by React Router.

---

## Step 6: Verify Deployment

1. Visit `https://srcry.in` in your browser
2. Check if the site loads correctly
3. Test navigation (all routes should work)
4. Test features (cart, wishlist, etc.)

---

## Step 7: Update Process (For Future Updates)

When you make changes and want to update the live site:

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Upload new files:**
   - Delete old files from `public_html/` (or just overwrite)
   - Upload new `dist/` contents
   - Keep `.htaccess` file

3. **Clear browser cache** (or wait a few minutes for CDN cache to clear)

---

## Troubleshooting

### Issue: 404 errors on routes
**Solution:** Make sure `.htaccess` file is in `public_html/` root

### Issue: Blank page
**Solution:** 
- Check browser console for errors
- Verify all files uploaded correctly
- Check file permissions (should be 644 for files, 755 for folders)

### Issue: Assets not loading
**Solution:**
- Check if `assets/` folder uploaded correctly
- Verify file paths in browser Network tab
- Ensure `vite.config.ts` has correct `base` setting (should be `/` for root domain)

### Issue: Slow loading
**Solution:**
- Enable gzip compression in Hostinger
- Consider using a CDN
- Optimize images before upload

---

## Optional: Enable HTTPS/SSL

1. Go to **SSL** in Hostinger hPanel
2. Install **Let's Encrypt SSL** (free)
3. Force HTTPS redirect (optional, in `.htaccess`):

```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## File Structure After Deployment

```
public_html/
├── index.html
├── .htaccess
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
└── [other static files]
```

---

## Quick Update Script (Optional)

Create a script to automate updates:

**`deploy.sh`** (for Linux/Mac):
```bash
#!/bin/bash
npm run build
# Then use FTP or rsync to upload dist/ to server
```

**`deploy.bat`** (for Windows):
```batch
@echo off
npm run build
echo Build complete! Now upload dist/ folder to Hostinger.
pause
```

---

## Notes

- **First deployment:** Takes longer, upload all files
- **Updates:** Only upload changed files (faster)
- **Backup:** Always keep a backup of your current live site before updating
- **Testing:** Test locally with `npm run preview` before deploying

---

## Support

If you encounter issues:
1. Check Hostinger documentation
2. Check browser console for errors
3. Verify file permissions
4. Contact Hostinger support if needed

---

**Your site should now be live at https://srcry.in! 🎉**

