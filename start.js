const { spawn } = require('child_process');
const path = require('path');

console.log('\x1b[36m%s\x1b[0m', '=====================================================');
console.log('\x1b[36m%s\x1b[0m', '   🚀 Launching VeritasLens AI Forensic Platform');
console.log('\x1b[36m%s\x1b[0m', '   PromptWars x µLearn SJCET Hackathon Edition');
console.log('\x1b[36m%s\x1b[0m', '=====================================================\n');

// 1. Start Server
const serverProcess = spawn('node', ['server/index.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// 2. Start Client Dev Server
const clientProcess = spawn('npm.cmd', ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
});
