const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '../apps/dashboard/public/images/phones/iphone-sms.svg');
const imgPath = path.join(__dirname, '../apps/dashboard/public/images/providers/light/square/notify.jpg');

let content = fs.readFileSync(svgPath, 'utf8');
const imgData = fs.readFileSync(imgPath);
const base64Str = `data:image/jpeg;base64,${imgData.toString('base64')}`;

// The SVG paths we want to replace
const iconCircle = '<path fill="#0E121B" fill-opacity=".9" d="M129.91 50.868c0-5.963 4.814-10.798 10.752-10.798 5.938 0 10.752 4.835 10.752 10.798 0 5.964-4.814 10.798-10.752 10.798-5.938 0-10.752-4.834-10.752-10.798Z"/>';

// We know from previous inspection that there are 5 consecutive path elements for the logo+text.
// Let's use a regex to match the circle and the following 4 paths.
const regex = /<path fill="#0E121B" fill-opacity="\.9" d="M129\.91 50\.868[^>]+>[\s\S]*?<path fill="#000" d="M131\.391 74\.49v-4\.756[^>]+>/m;

const replacement = `
  <image href="${base64Str}" x="129.91" y="40.07" width="21.5" height="21.5" preserveAspectRatio="xMidYMid slice" style="border-radius: 4px;" clip-path="url(#notifyClip)" />
  <clipPath id="notifyClip">
    <rect x="129.91" y="40.07" width="21.5" height="21.5" rx="5" />
  </clipPath>
  <text x="140.66" y="74.49" font-family="sans-serif" font-size="8" font-weight="bold" fill="#000" text-anchor="middle">Notify</text>
`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(svgPath, content);
  console.log('Successfully replaced top center logo and text in iphone-sms.svg');
} else {
  console.log('Could not find the target SVG paths in iphone-sms.svg');
}
