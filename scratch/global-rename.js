const fs = require('fs');
const path = require('path');

const EXCLUDED_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'build', '.pnpm', '.swc']);

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (EXCLUDED_DIRS.has(f)) continue;
    const dirPath = path.join(dir, f);
    const stat = fs.statSync(dirPath);
    if (stat.isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  }
}

const rootDir = '/workspaces/codespaces-blank/novu';
let count = 0;

walkDir(rootDir, (filePath) => {
  if (filePath.match(/\.(ts|tsx|js|jsx|json|md|mdx|html|sh|yml|yaml|mjs|cjs)$/)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('@novu/')) {
        const newContent = content.replace(/@novu\//g, '@notify/');
        fs.writeFileSync(filePath, newContent);
        count++;
      }
    } catch (e) {
      // ignore
    }
  }
});

console.log(`Updated ${count} files.`);
