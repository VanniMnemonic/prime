const { spawnSync } = require('child_process');

if (process.platform !== 'darwin') {
  console.error('This command must be run on macOS (darwin).');
  process.exit(1);
}

const commands = [
  ['npm', ['run', 'build:localize']],
  ['npm', ['run', 'build:electron']],
  ['npx', ['electron-builder', '--mac', '-p', 'never']],
];

for (const [cmd, args] of commands) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', shell: true });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
