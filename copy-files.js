const fs = require('fs-extra');

async function copyFiles() {
  try {
    await fs.copy('package.json', 'dist/package.json');
    await fs.copy('yarn.lock', 'dist/yarn.lock');
    await fs.copy('src/keys', 'dist/keys');
    console.log('Files copied successfully!');
  } catch (err) {
    console.error('Error copying files:', err);
  }
}

copyFiles();
