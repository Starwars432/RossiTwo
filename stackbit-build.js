import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log environment for debugging
console.log('Environment variables:', process.env.NODE_ENV, process.env.ENABLE_VISUAL_EDITOR);
console.log('Current directory:', __dirname);

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
  
  // Function to recursively copy directory
  const copyDir = (src, dest) => {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  };
  
  // Copy public directory contents to dist
  const publicDir = path.join(__dirname, 'public');
  if (fs.existsSync(publicDir)) {
    console.log('Copying public directory to dist...');
    const entries = fs.readdirSync(publicDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(publicDir, entry.name);
      const destPath = path.join(distDir, entry.name);
      
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  
  // Create _redirects file for Netlify to properly handle SPAs
  fs.writeFileSync(
    path.join(distDir, '_redirects'),
    '/* /index.html 200'
  );
  
  // Verify build output
  const files = fs.readdirSync(distDir);
  console.log(`Files in dist directory: ${files.length}`);
  console.log('Files:', files.join(', '));
  
  // Check for index.html to ensure build was successful
  if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    console.error('Error: index.html not found in dist directory');
    process.exit(1);
  } else {
    console.log('Success: index.html found in dist directory');
  }
  
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}