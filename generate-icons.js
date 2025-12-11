import fs from 'fs';
import path from 'path';

const sizes = [16, 32, 48, 128];

const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#4285F4" rx="64"/>
  <g fill="white">
    <!-- Calendar grid -->
    <rect x="80" y="180" width="352" height="232" fill="none" stroke="white" stroke-width="8" rx="16"/>

    <!-- Calendar header -->
    <rect x="80" y="140" width="352" height="60" fill="white" rx="16"/>

    <!-- Days of week -->
    <g fill="#4285F4" font-family="Arial" font-size="24" font-weight="bold">
      <text x="110" y="175" text-anchor="middle">S</text>
      <text x="160" y="175" text-anchor="middle">M</text>
      <text x="210" y="175" text-anchor="middle">T</text>
      <text x="260" y="175" text-anchor="middle">W</text>
      <text x="310" y="175" text-anchor="middle">T</text>
      <text x="360" y="175" text-anchor="middle">F</text>
      <text x="410" y="175" text-anchor="middle">S</text>
    </g>

    <!-- Calendar dates with tasks -->
    <circle cx="110" cy="230" r="4"/>
    <circle cx="160" cy="230" r="4"/>
    <circle cx="210" cy="230" r="4" fill="#EA4335"/>
    <circle cx="260" cy="230" r="4"/>
    <circle cx="310" cy="230" r="4" fill="#FBBC04"/>

    <circle cx="110" cy="280" r="4"/>
    <circle cx="160" cy="280" r="4" fill="#34A853"/>
    <circle cx="210" cy="280" r="4"/>
    <circle cx="260" cy="280" r="4" fill="#EA4335"/>
    <circle cx="310" cy="280" r="4"/>

    <!-- Checkmark for completed tasks -->
    <path d="M320 340 L340 360 L380 300" fill="none" stroke="#34A853" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;

// アイコン用ディレクトリが存在しない場合は作成
const iconsDir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 各サイズのPNGアイコンを生成するためのHTML（ブラウザで変換）
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Icon Generator</title>
</head>
<body>
  <h1>Calendar TODO Icon Generator</h1>
  <p>SVGアイコンを各サイズのPNGに変換するには、以下の手順を実行してください：</p>
  <ol>
    <li>各キャンバスを右クリックして「画像として保存」を選択</li>
    <li>ファイル名を「icon[サイズ].png」として保存（例: icon16.png, icon32.png, icon48.png, icon128.png）</li>
    <li>保存先は public/icons/ ディレクトリを選択</li>
  </ol>

  ${sizes.map(size => `
    <div style="margin: 20px 0;">
      <h3>Icon ${size}x${size}</h3>
      <canvas id="canvas${size}" width="${size}" height="${size}" style="border: 1px solid #ccc;"></canvas>
    </div>
  `).join('')}

  <script>
    const svgContent = \`${svgContent}\`;
    const sizes = [${sizes.join(', ')}];

    sizes.forEach(size => {
      const canvas = document.getElementById('canvas' + size);
      const ctx = canvas.getContext('2d');

      const img = new Image();
      img.onload = function() {
        ctx.drawImage(img, 0, 0, size, size);
      };

      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      img.src = url;
    });
  </script>
</body>
</html>
`;

// HTMLファイルを保存
fs.writeFileSync(path.join(iconsDir, 'generate.html'), htmlContent);

// SVGファイルも保存
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgContent);

console.log('Icon generation files created!');
console.log('1. Open public/icons/generate.html in a browser');
console.log('2. Right-click each canvas and save as PNG with the appropriate name');
console.log('3. Save to public/icons/ directory');