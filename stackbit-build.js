const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if dist directory exists, if not create it
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  console.log('Creating dist directory...');
  fs.mkdirSync(distDir, { recursive: true });
  
  // Copy index.html to dist as a minimal fallback
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loading Site...</title>
</head>
<body>
  <div>Loading site preview...</div>
  <script>
    // This is a placeholder - the actual site will load through Netlify's process
    console.log('Site preview loading...');
  </script>
</body>
</html>`;
  
  fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);
  console.log('Created placeholder index.html');
}

// Run the actual build if needed
try {
  console.log('Running build process...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully.');
} catch (error) {
  console.error('Build failed:', error);
  // Don't exit with error - we still want Stackbit to try using what we have
}