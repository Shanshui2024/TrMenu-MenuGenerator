const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 配置
const ITEM_SIZE = 16;
const ITEMS_PER_ROW = 32;
const INPUT_DIR = path.join(__dirname, '../public/minecraft_assets/assets/minecraft/textures/item');
const OUTPUT_DIR = path.join(__dirname, '../public');
const SPRITE_NAME = 'minecraft-items-sprite.png';
const MAP_NAME = 'minecraft-items-map.json';

async function generateSprite() {
  console.log('🔍 扫描物品纹理...');
  
  const files = fs.readdirSync(INPUT_DIR)
    .filter(f => f.endsWith('.png'))
    .sort();
  
  console.log(`📦 找到 ${files.length} 个物品纹理`);
  
  const totalItems = files.length;
  const rows = Math.ceil(totalItems / ITEMS_PER_ROW);
  const canvasWidth = ITEMS_PER_ROW * ITEM_SIZE;
  const canvasHeight = rows * ITEM_SIZE;
  
  console.log(`📐 创建精灵图: ${canvasWidth}x${canvasHeight}`);
  
  const canvas = await sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  }).png();
  
  const itemMap = {};
  const compositeImages = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const itemName = path.basename(file, '.png');
    const row = Math.floor(i / ITEMS_PER_ROW);
    const col = i % ITEMS_PER_ROW;
    const x = col * ITEM_SIZE;
    const y = row * ITEM_SIZE;
    
    try {
      const imagePath = path.join(INPUT_DIR, file);
      const resizedBuffer = await sharp(imagePath)
        .resize(ITEM_SIZE, ITEM_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      
      compositeImages.push({
        input: resizedBuffer,
        top: y,
        left: x
      });
      
      itemMap[itemName] = { x, y, row, col };
      
      if ((i + 1) % 100 === 0) {
        console.log(`  ✓ 已处理 ${i + 1}/${files.length}`);
      }
    } catch (error) {
      console.error(`  ✗ 加载失败: ${file}`, error.message);
    }
  }
  
  console.log('🎨 合成精灵图...');
  
  const spriteBuffer = await canvas
    .composite(compositeImages)
    .png({ compressionLevel: 9 })
    .toBuffer();
  
  console.log('💾 保存文件...');
  
  fs.writeFileSync(path.join(OUTPUT_DIR, SPRITE_NAME), spriteBuffer);
  
  const mapData = {
    spriteSize: { width: canvasWidth, height: canvasHeight },
    itemSize: ITEM_SIZE,
    itemsPerRow: ITEMS_PER_ROW,
    totalItems: files.length,
    items: itemMap
  };
  fs.writeFileSync(
    path.join(OUTPUT_DIR, MAP_NAME),
    JSON.stringify(mapData, null, 2)
  );
  
  console.log('✅ 完成！');
  console.log(`   精灵图: ${SPRITE_NAME} (${(spriteBuffer.length / 1024).toFixed(2)} KB)`);
  console.log(`   映射表: ${MAP_NAME}`);
  console.log(`   物品数: ${files.length}`);
}

generateSprite().catch(console.error);
