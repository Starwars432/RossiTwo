import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  console.log('Creating dist directory...');
  fs.mkdirSync(distDir, { recursive: true });
}

// Run build command
try {
  console.log('Running build process...');
  execSync('npm run build', { 
    stdio: 'inherit',
    env: { 
      ...process.env,
      PUBLIC_URL: '/',
      NODE_ENV: 'production'
    }
  });
  
  console.log('Build completed successfully');
  
  // Copy admin files if they exist
  const adminDir = path.join(__dirname, 'public', 'admin');
  const distAdminDir = path.join(distDir, 'admin');
  
  if (fs.existsSync(adminDir)) {
    if (!fs.existsSync(distAdminDir)) {
      fs.mkdirSync(distAdminDir, { recursive: true });
    }
    fs.readdirSync(adminDir).forEach(file => {
      fs.copyFileSync(
        path.join(adminDir, file),
        path.join(distAdminDir, file)
      );
    });
  }
  
  // Copy Visual Editor (vos) files if they exist
  const vosDir = path.join(__dirname, 'public', 'vos');
  const distVosDir = path.join(distDir, 'vos');
  
  if (fs.existsSync(vosDir)) {
    if (!fs.existsSync(distVosDir)) {
      fs.mkdirSync(distVosDir, { recursive: true });
    }
    fs.readdirSync(vosDir).forEach(file => {
      fs.copyFileSync(
        path.join(vosDir, file),
        path.join(distVosDir, file)
      );
    });
  }
  
  // Copy any additional static files from public that might not be included in the build
  const publicDir = path.join(__dirname, 'public');
  fs.readdirSync(publicDir).forEach(file => {
    // Skip admin and vos directories as we've already handled them
    if (file !== 'admin' && file !== 'vos') {
      const srcPath = path.join(publicDir, file);
      const destPath = path.join(distDir, file);
      
      // Skip if it's a directory (for now, we could make this recursive if needed)
      if (!fs.lstatSync(srcPath).isDirectory()) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  });
  
  // Create _redirects file for Netlify to properly handle SPAs
  fs.writeFileSync(
    path.join(distDir, '_redirects'),
    '/* /index.html 200'
  );
  
  // Verify build output
  const files = fs.readdirSync(distDir);
  console.log(`Files in dist directory: ${files.length}`);
  console.log('Files:', files.join(', '));
  
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}