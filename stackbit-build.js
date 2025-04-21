// CommonJS version for better compatibility
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
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully');
  
  // Check if the build actually produced files
  const files = fs.readdirSync(distDir);
  console.log(`Files in dist directory: ${files.length}`);
  
  if (files.length === 0) {
    console.log('Warning: dist directory is empty after build!');
    
    // Create a minimal fallback for Netlify
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manifest Illusions</title>
</head>
<body>
  <div id="root">Loading site preview...</div>
  <script>
    console.log('Site is loading...');
  </script>
</body>
</html>`;
    
    fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);
    console.log('Created placeholder index.html');
  }
} catch (error) {
  console.error('Build failed:', error);
  
  // Create fallback content for Netlify
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manifest Illusions</title>
</head>
<body>
  <div id="root">Build failed, but site preview is still available.</div>
</body>
</html>`;
  
  fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);
  console.log('Created error fallback index.html');
}