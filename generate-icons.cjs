const fs = require('fs');
const path = require('path');

// シンプルなPNGを生成（青い四角形にチェックマーク）
function createSimplePNG(size) {
  // PNG header
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const width = size;
  const height = size;
  const bitDepth = 8;
  const colorType = 2; // RGB
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(bitDepth, 8);
  ihdrData.writeUInt8(colorType, 9);
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace
  
  const ihdrChunk = createChunk('IHDR', ihdrData);
  
  // IDAT chunk - create image data
  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0); // filter byte
    for (let x = 0; x < width; x++) {
      // Blue background (#4285F4)
      let r = 66, g = 133, b = 244;
      
      // White checkmark area (simplified)
      const cx = width / 2;
      const cy = height / 2;
      const checkSize = size * 0.3;
      
      // Draw a simple white check mark
      const relX = x - cx;
      const relY = y - cy;
      
      // Check mark pattern
      if (
        (relX > -checkSize * 0.5 && relX < 0 && Math.abs(relY - relX * 0.7) < size * 0.08) ||
        (relX >= 0 && relX < checkSize * 0.8 && Math.abs(relY + relX * 0.5 - checkSize * 0.2) < size * 0.08)
      ) {
        r = 255; g = 255; b = 255;
      }
      
      rawData.push(r, g, b);
    }
  }
  
  // Compress with zlib
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(Buffer.from(rawData));
  const idatChunk = createChunk('IDAT', compressed);
  
  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const typeBuffer = Buffer.from(type);
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = crc32(crcData);
  
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc >>> 0, 0);
  
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function crc32(data) {
  let crc = 0xFFFFFFFF;
  const table = [];
  
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  
  return crc ^ 0xFFFFFFFF;
}

// Generate icons
const sizes = [16, 32, 48, 128];
const publicDir = path.join(__dirname, 'public', 'icons');
const distDir = path.join(__dirname, 'dist', 'icons');

sizes.forEach(size => {
  const png = createSimplePNG(size);
  const filename = `icon${size}.png`;
  
  fs.writeFileSync(path.join(publicDir, filename), png);
  console.log(`Generated: public/icons/${filename}`);
  
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, filename), png);
    console.log(`Generated: dist/icons/${filename}`);
  }
});

console.log('All icons generated!');
