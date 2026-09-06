const { spawn } = require('child_process');
const path = require('path');

console.log('\x1b[36m%s\x1b[0m', '=====================================================');
console.log('\x1b[36m%s\x1b[0m', '   🚀 Launching ProofLens / VeritasLens Platform');
console.log('\x1b[36m%s\x1b[0m', '   Enterprise Forensic & Verification Engine');
console.log('\x1b[36m%s\x1b[0m', '=====================================================\n');

// 1. Start Server safely using current node runtime
const serverProcess = spawn(process.execPath, [path.join(__dirname, 'server', 'index.js')], {
  cwd: __dirname,
  stdio: 'inherit'
});

// 2. Start Client Dev Server
const isWin = process.platform === 'win32';
const clientProcess = isWin
  ? spawn('cmd.exe', ['/c', 'npm', 'run', 'dev'], { cwd: path.join(__dirname, 'client'), stdio: 'inherit' })
  : spawn('npm', ['run', 'dev'], { cwd: path.join(__dirname, 'client'), stdio: 'inherit' });

process.on('SIGINT', () => {
  try { serverProcess.kill(); } catch {}
  try { clientProcess.kill(); } catch {}
  process.exit();
});