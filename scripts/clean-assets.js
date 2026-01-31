const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ASSETS_DIR = path.join(__dirname, '../public/minecraft_assets');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🧹 清理 Minecraft 原始资源文件');
console.log('');
console.log('⚠️  警告：此操作将删除 public/minecraft_assets/ 目录');
console.log('');
console.log('保留的文件：');
console.log('  ✓ public/minecraft-items-sprite.png (精灵图)');
console.log('  ✓ public/minecraft-items-map.json (映射表)');
console.log('');
console.log('删除的文件：');
console.log('  ✗ public/minecraft_assets/ (原始资源，约 50MB+)');
console.log('');
console.log('💡 提示：如需重新生成精灵图，需要重新下载 Minecraft 资源');
console.log('');

rl.question('确认删除？(yes/no): ', (answer) => {
  if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
    if (fs.existsSync(ASSETS_DIR)) {
      console.log('');
      console.log('🗑️  正在删除...');
      
      try {
        fs.rmSync(ASSETS_DIR, { recursive: true, force: true });
        console.log('✅ 删除成功！');
        console.log('');
        console.log('节省空间：约 50MB+');
        console.log('');
        console.log('📝 注意：');
        console.log('  - 精灵图和映射表已保留');
        console.log('  - 应用功能不受影响');
        console.log('  - 如需重新生成，请参考 ASSETS_README.md');
      } catch (error) {
        console.error('❌ 删除失败:', error.message);
      }
    } else {
      console.log('');
      console.log('ℹ️  目录不存在，无需清理');
    }
  } else {
    console.log('');
    console.log('❌ 已取消');
  }
  
  rl.close();
});
