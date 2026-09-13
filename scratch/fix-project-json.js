const fs = require('fs');
const glob = require('glob');

const files = glob.sync('/workspaces/codespaces-blank/novu/**/project.json', { ignore: ['**/node_modules/**', '**/.git/**'] });
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('@novu/')) {
    content = content.replace(/@novu\//g, '@notify/');
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
}
