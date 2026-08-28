import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('📦 [VERCEL BUILD] Installing frontend dependencies...');
execSync('npm install', { cwd: 'frontend', stdio: 'inherit' });

console.log('⚡ [VERCEL BUILD] Building Vite bundle...');
execSync('npm run build', { cwd: 'frontend', stdio: 'inherit' });

console.log('📁 [VERCEL BUILD] Copying frontend/dist to root dist folder...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}
fs.cpSync('frontend/dist', 'dist', { recursive: true });

console.log('🎉 [VERCEL BUILD] Success! Root dist is ready for deployment.');
