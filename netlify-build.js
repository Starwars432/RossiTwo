import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Exit codes
const EXIT_CODES = {
  SUCCESS: 0,
  BUILD_FAILURE: 1,
  FILE_SYSTEM_ERROR: 2,
  VALIDATION_ERROR: 3,
  ENV_ERROR: 4
};

// Required environment variables with defaults
const REQUIRED_ENV_VARS = {
  NODE_ENV: 'production',
  PUBLIC_URL: '/',
  ENABLE_VISUAL_EDITOR: undefined // Optional, no default
};

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enhanced logging with timestamps
const log = {
  info: (message) => console.log(`[${new Date().toISOString()}] INFO: ${message}`),
  warn: (message) => console.warn(`[${new Date().toISOString()}] WARN: ${message}`),
  error: (message, error) => console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error || '')
};

// Function to validate environment variables
const validateEnvironment = () => {
  const missing = [];
  const warnings = [];

  for (const [key, defaultValue] of Object.entries(REQUIRED_ENV_VARS)) {
    if (!process.env[key]) {
      if (defaultValue !== undefined) {
        process.env[key] = defaultValue;
        warnings.push(`${key} not set, using default: ${defaultValue}`);
      } else if (key !== 'ENABLE_VISUAL_EDITOR') { // Skip optional vars
        missing.push(key);
      }
    }
  }

  warnings.forEach(warning => log.warn(warning));
  
  if (missing.length > 0) {
    log.error(`Missing required environment variables: ${missing.join(', ')}`);
    return false;
  }

  // Additional environment validation
  if (process.env.NODE_ENV !== 'production') {
    log.warn('NODE_ENV should be "production" for deployment builds');
  }

  return true;
};

// Function to verify directory exists and is accessible
const verifyDirectory = (dir, createIfMissing = false) => {
  try {
    if (!fs.existsSync(dir)) {
      if (createIfMissing) {
        fs.mkdirSync(dir, { recursive: true });
        fs.chmodSync(dir, 0o755);
        log.info(`Created directory: ${dir}`);
      } else {
        log.error(`Directory not found: ${dir}`);
        return false;
      }
    }

    try {
      fs.accessSync(dir, fs.constants.R_OK | fs.constants.W_OK);
      return true;
    } catch (error) {
      log.error(`Directory ${dir} is not accessible or writable`, error);
      return false;
    }
  } catch (error) {
    log.error(`Failed to verify/create directory: ${dir}`, error);
    return false;
  }
};

// Function to safely copy directories with progress tracking
const copyDir = (src, dest) => {
  if (!verifyDirectory(src)) {
    log.warn(`Source directory ${src} not found or not accessible, skipping copy`);
    return;
  }

  try {
    if (!verifyDirectory(dest, true)) {
      throw new Error(`Failed to create or access destination directory: ${dest}`);
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    let processed = 0;
    const total = entries.length;

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (!fs.existsSync(srcPath)) {
        log.warn(`Source path no longer exists: ${srcPath}`);
        continue;
      }

      try {
        if (entry.isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
          fs.chmodSync(destPath, 0o644);
        }
        processed++;
        if (processed % 10 === 0 || processed === total) {
          log.info(`Copied ${processed}/${total} files`);
        }
      } catch (err) {
        log.error(`Failed to copy ${srcPath} to ${destPath}`, err);
        throw err;
      }
    }
  } catch (err) {
    log.error(`Error in copyDir from ${src} to ${dest}`, err);
    process.exit(EXIT_CODES.FILE_SYSTEM_ERROR);
  }
};

// Function to safely write file
const writeFile = (filePath, content) => {
  const dir = path.dirname(filePath);
  if (!verifyDirectory(dir, true)) {
    process.exit(EXIT_CODES.FILE_SYSTEM_ERROR);
  }

  try {
    fs.writeFileSync(filePath, content);
    fs.chmodSync(filePath, 0o644);
    log.info(`Created file: ${filePath}`);
  } catch (error) {
    log.error(`Failed to write file ${filePath}`, error);
    process.exit(EXIT_CODES.FILE_SYSTEM_ERROR);
  }
};

// Function to run build command safely
const runBuildCommand = (command, env = {}) => {
  log.info(`Running command: ${command}`);
  try {
    execSync(command, { 
      stdio: 'inherit',
      env: { 
        ...process.env,
        ...env
      }
    });
  } catch (error) {
    log.error(`Command failed: ${command}`, error);
    process.exit(EXIT_CODES.BUILD_FAILURE);
  }
};

// Modular build steps
const buildSteps = {
  typeCheck: () => {
    log.info('Running type check...');
    runBuildCommand('npm run type-check');
  },

  build: () => {
    log.info('Running build...');
    runBuildCommand('npm run build', {
      PUBLIC_URL: process.env.PUBLIC_URL,
      NODE_ENV: process.env.NODE_ENV
    });
  },

  copyPublicFiles: (distDir) => {
    const publicDir = path.join(__dirname, 'public');
    if (fs.existsSync(publicDir)) {
      log.info('Copying public directory contents...');
      copyDir(publicDir, distDir);
    }
  },

  createRedirects: (distDir) => {
    log.info('Creating Netlify redirects...');
    writeFile(
      path.join(distDir, '_redirects'),
      '/* /index.html 200'
    );
  },

  verifyOutput: (distDir) => {
    log.info('Verifying build output...');
    if (!verifyDirectory(distDir)) {
      log.error('Build directory verification failed');
      process.exit(EXIT_CODES.VALIDATION_ERROR);
    }

    try {
      const files = fs.readdirSync(distDir);
      log.info(`Found ${files.length} files in dist directory`);
      
      if (!fs.existsSync(path.join(distDir, 'index.html'))) {
        log.error('index.html not found in dist directory');
        process.exit(EXIT_CODES.VALIDATION_ERROR);
      }
      
      log.info('Build validation completed successfully');
    } catch (err) {
      log.error('Error verifying build output', err);
      process.exit(EXIT_CODES.VALIDATION_ERROR);
    }
  }
};

// Main build process
try {
  log.info('Starting build process...');
  log.info(`Environment: ${JSON.stringify({
    NODE_ENV: process.env.NODE_ENV,
    ENABLE_VISUAL_EDITOR: process.env.ENABLE_VISUAL_EDITOR,
    PUBLIC_URL: process.env.PUBLIC_URL
  }, null, 2)}`);

  if (!validateEnvironment()) {
    process.exit(EXIT_CODES.ENV_ERROR);
  }

  const distDir = path.join(__dirname, 'dist');
  verifyDirectory(distDir, true);

  // Execute build steps
  buildSteps.typeCheck();
  buildSteps.build();
  buildSteps.copyPublicFiles(distDir);
  buildSteps.createRedirects(distDir);
  buildSteps.verifyOutput(distDir);

  log.info('Build process completed successfully');
  process.exit(EXIT_CODES.SUCCESS);
} catch (error) {
  log.error('Build process failed', error);
  process.exit(EXIT_CODES.BUILD_FAILURE);
} finally {
  log.info('Build script finished');
}