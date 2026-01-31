const fs = require('fs');
const path = require('path');

const TEXTURES_DIR = path.join(__dirname, '../public/minecraft_assets/assets/minecraft/textures');
const ITEM_DIR = path.join(TEXTURES_DIR, 'item');
const BLOCK_DIR = path.join(TEXTURES_DIR, 'block');

// 特殊物品映射：从其他文件夹复制到 item 文件夹
const specialItems = [
  // 盾牌
  { from: 'entity/shield_base.png', to: 'shield.png' },
  // 三叉戟
  { from: 'entity/trident.png', to: 'trident.png' },
];

// 多纹理方块映射：使用特定面的纹理
const multiTextureBlocks = [
  { from: 'block/grass_block_side.png', to: 'grass_block.png' },
  { from: 'block/tnt_top.png', to: 'tnt.png' },
  { from: 'block/crafting_table_top.png', to: 'crafting_table.png' },
  { from: 'block/furnace_front.png', to: 'furnace.png' },
  { from: 'block/chest_front.png', to: 'chest.png', fallback: 'entity/chest/normal.png' },
  { from: 'block/ender_chest_front.png', to: 'ender_chest.png', fallback: 'entity/chest/ender.png' },
  { from: 'block/command_block_back.png', to: 'command_block.png' },
  { from: 'block/dispenser_front.png', to: 'dispenser.png' },
  { from: 'block/dropper_front.png', to: 'dropper.png' },
  { from: 'block/observer_front.png', to: 'observer.png' },
  { from: 'block/piston_top.png', to: 'piston.png' },
  // 染色玻璃板（使用顶部纹理）
  { from: 'block/white_stained_glass_pane_top.png', to: 'white_stained_glass_pane.png' },
  { from: 'block/black_stained_glass_pane_top.png', to: 'black_stained_glass_pane.png' },
  { from: 'block/red_stained_glass_pane_top.png', to: 'red_stained_glass_pane.png' },
  { from: 'block/green_stained_glass_pane_top.png', to: 'green_stained_glass_pane.png' },
  { from: 'block/blue_stained_glass_pane_top.png', to: 'blue_stained_glass_pane.png' },
  { from: 'block/yellow_stained_glass_pane_top.png', to: 'yellow_stained_glass_pane.png' },
  { from: 'block/orange_stained_glass_pane_top.png', to: 'orange_stained_glass_pane.png' },
  { from: 'block/purple_stained_glass_pane_top.png', to: 'purple_stained_glass_pane.png' },
  { from: 'block/lime_stained_glass_pane_top.png', to: 'lime_stained_glass_pane.png' },
  { from: 'block/pink_stained_glass_pane_top.png', to: 'pink_stained_glass_pane.png' },
  { from: 'block/light_blue_stained_glass_pane_top.png', to: 'light_blue_stained_glass_pane.png' },
  { from: 'block/magenta_stained_glass_pane_top.png', to: 'magenta_stained_glass_pane.png' },
  { from: 'block/cyan_stained_glass_pane_top.png', to: 'cyan_stained_glass_pane.png' },
  { from: 'block/gray_stained_glass_pane_top.png', to: 'gray_stained_glass_pane.png' },
  { from: 'block/light_gray_stained_glass_pane_top.png', to: 'light_gray_stained_glass_pane.png' },
  { from: 'block/brown_stained_glass_pane_top.png', to: 'brown_stained_glass_pane.png' },
];

// 动画纹理映射：使用第一帧
const animatedTextures = [
  { from: 'item/crossbow_standby.png', to: 'crossbow.png' },
  { from: 'item/compass_00.png', to: 'compass.png' },
  { from: 'item/clock_00.png', to: 'clock.png' },
];

// 常用方块列表（如果 item 文件夹没有，就从 block 文件夹复制）
const commonBlocks = [
  'stone', 'grass_block', 'dirt', 'cobblestone', 'oak_planks', 'spruce_planks',
  'birch_planks', 'jungle_planks', 'acacia_planks', 'dark_oak_planks',
  'glass', 'sand', 'gravel', 'gold_block', 'iron_block', 'diamond_block',
  'emerald_block', 'redstone_block', 'lapis_block', 'coal_block',
  'obsidian', 'bedrock', 'netherrack', 'end_stone', 'glowstone',
  'tnt', 'bookshelf', 'crafting_table', 'furnace', 'chest',
  'ender_chest', 'beacon', 'hopper', 'dispenser', 'dropper',
  'observer', 'piston', 'sticky_piston', 'redstone_lamp',
  'white_wool', 'orange_wool', 'magenta_wool', 'light_blue_wool',
  'yellow_wool', 'lime_wool', 'pink_wool', 'gray_wool',
  'light_gray_wool', 'cyan_wool', 'purple_wool', 'blue_wool',
  'brown_wool', 'green_wool', 'red_wool', 'black_wool',
  'white_concrete', 'orange_concrete', 'magenta_concrete', 'light_blue_concrete',
  'yellow_concrete', 'lime_concrete', 'pink_concrete', 'gray_concrete',
  'light_gray_concrete', 'cyan_concrete', 'purple_concrete', 'blue_concrete',
  'brown_concrete', 'green_concrete', 'red_concrete', 'black_concrete',
  'white_stained_glass', 'orange_stained_glass', 'magenta_stained_glass',
  'light_blue_stained_glass', 'yellow_stained_glass', 'lime_stained_glass',
  'pink_stained_glass', 'gray_stained_glass', 'light_gray_stained_glass',
  'cyan_stained_glass', 'purple_stained_glass', 'blue_stained_glass',
  'brown_stained_glass', 'green_stained_glass', 'red_stained_glass',
  'black_stained_glass', 'oak_log', 'spruce_log', 'birch_log',
  'jungle_log', 'acacia_log', 'dark_oak_log', 'oak_leaves',
  'spruce_leaves', 'birch_leaves', 'jungle_leaves', 'acacia_leaves',
  'dark_oak_leaves', 'sponge', 'wet_sponge', 'ice', 'packed_ice',
  'blue_ice', 'snow', 'snow_block', 'clay', 'terracotta',
  'bricks', 'stone_bricks', 'mossy_stone_bricks', 'cracked_stone_bricks',
  'nether_bricks', 'red_nether_bricks', 'quartz_block', 'smooth_quartz',
  'purpur_block', 'prismarine', 'prismarine_bricks', 'dark_prismarine',
  'sea_lantern', 'magma_block', 'soul_sand', 'soul_soil',
  'basalt', 'blackstone', 'gilded_blackstone', 'crying_obsidian',
  'ancient_debris', 'netherite_block', 'respawn_anchor', 'lodestone',
  'target', 'honey_block', 'honeycomb_block', 'slime_block',
  'dried_kelp_block', 'hay_block', 'bone_block', 'melon',
  'pumpkin', 'carved_pumpkin', 'jack_o_lantern', 'cake',
  'tnt', 'spawner', 'command_block', 'barrier', 'structure_void',
  'jigsaw', 'structure_block', 'light', 'conduit', 'end_portal_frame',
  'dragon_egg', 'anvil', 'chipped_anvil', 'damaged_anvil',
  'enchanting_table', 'brewing_stand', 'cauldron', 'end_rod',
  'purpur_pillar', 'end_stone_bricks', 'grass', 'fern',
  'dead_bush', 'seagrass', 'tall_seagrass', 'dandelion',
  'poppy', 'blue_orchid', 'allium', 'azure_bluet',
  'red_tulip', 'orange_tulip', 'white_tulip', 'pink_tulip',
  'oxeye_daisy', 'cornflower', 'lily_of_the_valley', 'wither_rose',
  'sunflower', 'lilac', 'rose_bush', 'peony',
  'tall_grass', 'large_fern', 'cactus', 'bamboo',
  'sugar_cane', 'kelp', 'vine', 'lily_pad',
  'brown_mushroom', 'red_mushroom', 'brown_mushroom_block', 'red_mushroom_block',
  'mushroom_stem', 'nether_wart', 'nether_wart_block', 'warped_wart_block',
  'crimson_nylium', 'warped_nylium', 'crimson_fungus', 'warped_fungus',
  'crimson_roots', 'warped_roots', 'nether_sprouts', 'weeping_vines',
  'twisting_vines', 'shroomlight', 'crimson_stem', 'warped_stem',
  'crimson_planks', 'warped_planks', 'soul_fire', 'soul_torch',
  'soul_lantern', 'soul_campfire', 'torch', 'lantern',
  'campfire', 'redstone_torch', 'redstone_lamp', 'sea_pickle',
  'end_rod', 'glowstone', 'jack_o_lantern', 'lava',
  'water', 'bubble_column', 'powder_snow', 'scaffolding',
  'ladder', 'rail', 'powered_rail', 'detector_rail',
  'activator_rail', 'lever', 'stone_button', 'oak_button',
  'stone_pressure_plate', 'oak_pressure_plate', 'light_weighted_pressure_plate',
  'heavy_weighted_pressure_plate', 'tripwire_hook', 'trapped_chest', 'tnt',
  'redstone_wire', 'redstone_torch', 'redstone_block', 'repeater',
  'comparator', 'daylight_detector', 'note_block', 'jukebox',
  'bell', 'lectern', 'composter', 'barrel', 'smoker',
  'blast_furnace', 'cartography_table', 'fletching_table', 'grindstone',
  'loom', 'smithing_table', 'stonecutter', 'bell',
];

console.log('🔧 修复特殊物品和方块贴图...');

let fixed = 0;
let skipped = 0;

// 处理特殊物品
specialItems.forEach(item => {
  const sourcePath = path.join(TEXTURES_DIR, item.from);
  const targetPath = path.join(ITEM_DIR, item.to);
  
  if (fs.existsSync(sourcePath)) {
    if (!fs.existsSync(targetPath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`  ✓ 复制: ${item.from} → item/${item.to}`);
      fixed++;
    } else {
      skipped++;
    }
  } else {
    console.log(`  ✗ 未找到: ${item.from}`);
  }
});

// 处理多纹理方块
console.log('\n📦 处理多纹理方块...');
multiTextureBlocks.forEach(item => {
  const sourcePath = path.join(TEXTURES_DIR, item.from);
  const targetPath = path.join(ITEM_DIR, item.to);
  
  if (fs.existsSync(sourcePath)) {
    if (!fs.existsSync(targetPath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`  ✓ 复制: ${item.from} → item/${item.to}`);
      fixed++;
    } else {
      skipped++;
    }
  } else if (item.fallback) {
    const fallbackPath = path.join(TEXTURES_DIR, item.fallback);
    if (fs.existsSync(fallbackPath) && !fs.existsSync(targetPath)) {
      fs.copyFileSync(fallbackPath, targetPath);
      console.log(`  ✓ 复制(备用): ${item.fallback} → item/${item.to}`);
      fixed++;
    } else if (fs.existsSync(targetPath)) {
      skipped++;
    } else {
      console.log(`  ✗ 未找到: ${item.from} 和 ${item.fallback}`);
    }
  } else {
    console.log(`  ✗ 未找到: ${item.from}`);
  }
});

// 处理动画纹理
console.log('\n🎬 处理动画纹理（使用第一帧）...');
animatedTextures.forEach(item => {
  const sourcePath = path.join(TEXTURES_DIR, item.from);
  const targetPath = path.join(ITEM_DIR, item.to);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`  ✓ 覆盖: ${item.from} → item/${item.to}`);
    fixed++;
  } else {
    console.log(`  ✗ 未找到: ${item.from}`);
  }
});

// 处理方块
console.log('\n📦 处理方块贴图...');
commonBlocks.forEach(blockName => {
  const blockPath = path.join(BLOCK_DIR, `${blockName}.png`);
  const itemPath = path.join(ITEM_DIR, `${blockName}.png`);
  
  if (fs.existsSync(blockPath) && !fs.existsSync(itemPath)) {
    fs.copyFileSync(blockPath, itemPath);
    console.log(`  ✓ 复制方块: ${blockName}`);
    fixed++;
  } else if (fs.existsSync(itemPath)) {
    skipped++;
  }
});

console.log(`\n✅ 完成！修复 ${fixed} 个，跳过 ${skipped} 个`);