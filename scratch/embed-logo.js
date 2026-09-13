const fs = require('fs');
const path = require('path');

const imgPath = path.join(__dirname, '../apps/dashboard/public/images/providers/light/square/notify.jpg');
const svgPath = path.join(__dirname, '../apps/dashboard/public/images/phones/iphone-sms.svg');

// Read the image and convert to base64
const imgData = fs.readFileSync(imgPath);
const base64Str = `data:image/jpeg;base64,${imgData.toString('base64')}`;

// Read the SVG
let svgContent = fs.readFileSync(svgPath, 'utf8');

// Replace the external link with the base64 string
svgContent = svgContent.replace(/\/images\/providers\/light\/square\/notify\.jpg/g, base64Str);

// Write back to the SVG
fs.writeFileSync(svgPath, svgContent);
console.log('Successfully embedded base64 logo into iphone-sms.svg');
