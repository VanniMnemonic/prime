const path = require('path');

// Register ts-node with the electron-specific configuration
require('ts-node').register({
  project: path.join(__dirname, '../../tsconfig.electron.json'),
  transpileOnly: false,
});

// Load the main TypeScript file
require('./main.ts');
