const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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
  
  // Verify build output
  const files = fs.readdirSync(distDir);
  console.log(`Files in dist directory: ${files.length}`);
  
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}