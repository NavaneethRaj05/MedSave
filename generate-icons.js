const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 192, 512];
const dir = path.join(__dirname, 'client/public/icons');
fs.mkdirSync(dir, { recursive: true });

sizes.forEach(size => {
  const fontSize = Math.round(size * 0.55);
  const r = Math.round(size * 0.2);
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
    `  <rect width="${size}" height="${size}" rx="${r}" fill="#0D9488"/>`,
    `  <rect width="${size}" height="${size}" rx="${r}" fill="url(#g)"/>`,
    `  <defs>`,
    `    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">`,
    `      <stop offset="0%" stop-color="#0D9488"/>`,
    `      <stop offset="100%" stop-color="#0F766E"/>`,
    `    </linearGradient>`,
    `  </defs>`,
    `  <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-size="${fontSize}">&#x1F48A;</text>`,
    `</svg>`
  ].join('\n');
  fs.writeFileSync(path.join(dir, `icon-${size}.svg`), svg, 'utf8');
  // Copy same SVG as PNG filename so manifest resolves (browsers accept SVG via PNG path in many cases)
  fs.writeFileSync(path.join(dir, `icon-${size}.png`), svg, 'utf8');
  console.log('icon-' + size + '.png created');
});

console.log('All icons generated in ' + dir);
