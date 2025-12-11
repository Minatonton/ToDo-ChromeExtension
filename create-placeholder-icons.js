// 簡易的なプレースホルダーアイコンを作成するスクリプト
// 実際のアイコンは後でデザインツールで作成してください

import fs from 'fs';
import path from 'path';

const sizes = [16, 32, 48, 128];
const iconsDir = path.join(process.cwd(), 'public', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 各サイズのプレースホルダーファイルを作成
sizes.forEach(size => {
  const filename = path.join(iconsDir, `icon${size}.png`);

  // 既にファイルが存在しない場合のみ作成
  if (!fs.existsSync(filename)) {
    // 空のファイルを作成（後で実際のアイコンに置き換える）
    fs.writeFileSync(filename, '');
    console.log(`Created placeholder: icon${size}.png`);
  }
});

console.log('Placeholder icons created in public/icons/');
console.log('Please replace these with actual PNG icons before publishing.');