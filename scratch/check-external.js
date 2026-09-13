const fs = require('fs');
const path = require('path');
const glob = require('glob');

const pkgFiles = glob.sync('/workspaces/codespaces-blank/novu/**/package.json', { ignore: ['**/node_modules/**', '**/.git/**'] });
for (const file of pkgFiles) {
  const content = JSON.parse(fs.readFileSync(file, 'utf8'));
  const checkDeps = (deps) => {
    if (!deps) return;
    for (const [key, val] of Object.entries(deps)) {
      if (key.startsWith('@notify/') && val !== 'workspace:*' && !val.includes('alpha')) {
        console.log(`${file}: ${key}@${val}`);
      }
    }
  };
  checkDeps(content.dependencies);
  checkDeps(content.devDependencies);
  checkDeps(content.peerDependencies);
}
