const { spawnSync } = require('child_process');

if (process.platform !== 'linux') {
  console.error('This command must be run on Linux.');
  process.exit(1);
}

const commands = [
  ['npm', ['run', 'build:localize']],
  ['npm', ['run', 'build:electron']],
  ['npx', ['electron-builder', '--linux', '-p', 'never']],
];

for (const [cmd, args] of commands) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', shell: true });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
