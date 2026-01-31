'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import MinecraftSpriteIcon from './MinecraftSpriteIcon';

interface Props {
  onSelect: (material: string) => void;
  onClose: () => void;
}

// Minecraft 1.21.4 常用材质列表（本地资源）
const MATERIALS = [
  // 方块
  { id: 'stone', name: '石头', category: '方块' },
  { id: 'grass_block', name: '草方块', category: '方块' },
  { id: 'dirt', name: '泥土', category: '方块' },
  { id: 'cobblestone', name: '圆石', category: '方块' },
  { id: 'oak_planks', name: '橡木板', category: '方块' },
  { id: 'glass', name: '玻璃', category: '方块' },
  { id: 'sand', name: '沙子', category: '方块' },
  { id: 'gravel', name: '沙砾', category: '方块' },
  { id: 'gold_block', name: '金块', category: '方块' },
  { id: 'iron_block', name: '铁块', category: '方块' },
  { id: 'diamond_block', name: '钻石块', category: '方块' },
  { id: 'emerald_block', name: '绿宝石块', category: '方块' },
  { id: 'redstone_block', name: '红石块', category: '方块' },
  { id: 'obsidian', name: '黑曜石', category: '方块' },
  { id: 'bedrock', name: '基岩', category: '方块' },
  { id: 'netherrack', name: '下界岩', category: '方块' },
  { id: 'end_stone', name: '末地石', category: '方块' },
  { id: 'glowstone', name: '荧石', category: '方块' },
  { id: 'tnt', name: 'TNT', category: '方块' },
  
  // 工具
  { id: 'diamond_sword', name: '钻石剑', category: '工具' },
  { id: 'diamond_pickaxe', name: '钻石镐', category: '工具' },
  { id: 'diamond_axe', name: '钻石斧', category: '工具' },
  { id: 'diamond_shovel', name: '钻石锹', category: '工具' },
  { id: 'diamond_hoe', name: '钻石锄', category: '工具' },
  { id: 'netherite_sword', name: '下界合金剑', category: '工具' },
  { id: 'netherite_pickaxe', name: '下界合金镐', category: '工具' },
  { id: 'bow', name: '弓', category: '工具' },
  { id: 'crossbow', name: '弩', category: '工具' },
  { id: 'fishing_rod', name: '钓鱼竿', category: '工具' },
  { id: 'shears', name: '剪刀', category: '工具' },
  { id: 'flint_and_steel', name: '打火石', category: '工具' },
  { id: 'compass', name: '指南针', category: '工具' },
  { id: 'clock', name: '时钟', category: '工具' },
  { id: 'spyglass', name: '望远镜', category: '工具' },
  
  // 装备
  { id: 'diamond_helmet', name: '钻石头盔', category: '装备' },
  { id: 'diamond_chestplate', name: '钻石胸甲', category: '装备' },
  { id: 'diamond_leggings', name: '钻石护腿', category: '装备' },
  { id: 'diamond_boots', name: '钻石靴子', category: '装备' },
  { id: 'netherite_helmet', name: '下界合金头盔', category: '装备' },
  { id: 'netherite_chestplate', name: '下界合金胸甲', category: '装备' },
  { id: 'shield', name: '盾牌', category: '装备' },
  { id: 'elytra', name: '鞘翅', category: '装备' },
  { id: 'turtle_helmet', name: '海龟壳', category: '装备' },
  
  // 食物
  { id: 'apple', name: '苹果', category: '食物' },
  { id: 'golden_apple', name: '金苹果', category: '食物' },
  { id: 'bread', name: '面包', category: '食物' },
  { id: 'cooked_beef', name: '熟牛肉', category: '食物' },
  { id: 'cooked_porkchop', name: '熟猪排', category: '食物' },
  { id: 'cake', name: '蛋糕', category: '食物' },
  { id: 'cookie', name: '曲奇', category: '食物' },
  { id: 'melon_slice', name: '西瓜片', category: '食物' },
  { id: 'carrot', name: '胡萝卜', category: '食物' },
  { id: 'golden_carrot', name: '金胡萝卜', category: '食物' },
  { id: 'suspicious_stew', name: '迷之炖菜', category: '食物' },
  
  // 物品
  { id: 'diamond', name: '钻石', category: '物品' },
  { id: 'emerald', name: '绿宝石', category: '物品' },
  { id: 'gold_ingot', name: '金锭', category: '物品' },
  { id: 'iron_ingot', name: '铁锭', category: '物品' },
  { id: 'netherite_ingot', name: '下界合金锭', category: '物品' },
  { id: 'coal', name: '煤炭', category: '物品' },
  { id: 'redstone', name: '红石', category: '物品' },
  { id: 'lapis_lazuli', name: '青金石', category: '物品' },
  { id: 'ender_pearl', name: '末影珍珠', category: '物品' },
  { id: 'ender_eye', name: '末影之眼', category: '物品' },
  { id: 'book', name: '书', category: '物品' },
  { id: 'enchanted_book', name: '附魔书', category: '物品' },
  { id: 'paper', name: '纸', category: '物品' },
  { id: 'map', name: '地图', category: '物品' },
  { id: 'nether_star', name: '下界之星', category: '物品' },
  { id: 'experience_bottle', name: '附魔之瓶', category: '物品' },
  { id: 'totem_of_undying', name: '不死图腾', category: '物品' },
  { id: 'echo_shard', name: '回响碎片', category: '物品' },
  
  // 特殊
  { id: 'barrier', name: '屏障', category: '特殊' },
  { id: 'command_block', name: '命令方块', category: '特殊' },
  { id: 'chest', name: '箱子', category: '特殊' },
  { id: 'ender_chest', name: '末影箱', category: '特殊' },
  { id: 'beacon', name: '信标', category: '特殊' },
  { id: 'hopper', name: '漏斗', category: '特殊' },
  { id: 'dispenser', name: '发射器', category: '特殊' },
  { id: 'dropper', name: '投掷器', category: '特殊' },
  { id: 'observer', name: '侦测器', category: '特殊' },
  { id: 'piston', name: '活塞', category: '特殊' },
  { id: 'crafting_table', name: '工作台', category: '特殊' },
  { id: 'furnace', name: '熔炉', category: '特殊' },
  
  // 染色玻璃板
  { id: 'white_stained_glass_pane', name: '白色玻璃板', category: '装饰' },
  { id: 'black_stained_glass_pane', name: '黑色玻璃板', category: '装饰' },
  { id: 'red_stained_glass_pane', name: '红色玻璃板', category: '装饰' },
  { id: 'green_stained_glass_pane', name: '绿色玻璃板', category: '装饰' },
  { id: 'blue_stained_glass_pane', name: '蓝色玻璃板', category: '装饰' },
  { id: 'yellow_stained_glass_pane', name: '黄色玻璃板', category: '装饰' },
  { id: 'orange_stained_glass_pane', name: '橙色玻璃板', category: '装饰' },
  { id: 'purple_stained_glass_pane', name: '紫色玻璃板', category: '装饰' },
  { id: 'lime_stained_glass_pane', name: '黄绿色玻璃板', category: '装饰' },
  { id: 'pink_stained_glass_pane', name: '粉红色玻璃板', category: '装饰' },
  { id: 'light_blue_stained_glass_pane', name: '淡蓝色玻璃板', category: '装饰' },
  { id: 'magenta_stained_glass_pane', name: '品红色玻璃板', category: '装饰' },
  
  // 染色玻璃
  { id: 'white_stained_glass', name: '白色玻璃', category: '装饰' },
  { id: 'black_stained_glass', name: '黑色玻璃', category: '装饰' },
  { id: 'red_stained_glass', name: '红色玻璃', category: '装饰' },
  { id: 'green_stained_glass', name: '绿色玻璃', category: '装饰' },
  { id: 'blue_stained_glass', name: '蓝色玻璃', category: '装饰' },
  { id: 'yellow_stained_glass', name: '黄色玻璃', category: '装饰' },
  { id: 'orange_stained_glass', name: '橙色玻璃', category: '装饰' },
  { id: 'purple_stained_glass', name: '紫色玻璃', category: '装饰' },
  { id: 'lime_stained_glass', name: '黄绿色玻璃', category: '装饰' },
  { id: 'pink_stained_glass', name: '粉红色玻璃', category: '装饰' },
  { id: 'light_blue_stained_glass', name: '淡蓝色玻璃', category: '装饰' },
  { id: 'magenta_stained_glass', name: '品红色玻璃', category: '装饰' },
  { id: 'cyan_stained_glass', name: '青色玻璃', category: '装饰' },
  { id: 'gray_stained_glass', name: '灰色玻璃', category: '装饰' },
  { id: 'light_gray_stained_glass', name: '淡灰色玻璃', category: '装饰' },
  { id: 'brown_stained_glass', name: '棕色玻璃', category: '装饰' },
];

export default function MaterialPicker({ onSelect, onClose }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [visibleCount, setVisibleCount] = useState(20); // 初始只显示20个

  const categories = ['全部', ...Array.from(new Set(MATERIALS.map(m => m.category)))];

  const filteredMaterials = MATERIALS.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(search.toLowerCase()) ||
                         material.id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 只显示部分材质，按需加载更多
  const visibleMaterials = filteredMaterials.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMaterials.length;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 20, filteredMaterials.length));
  };

  // 切换分类或搜索时重置显示数量
  useEffect(() => {
    setVisibleCount(20);
  }, [search, selectedCategory]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">选择材质</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-700">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索材质..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded text-white focus:border-sky-400 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded text-sm ${
                  selectedCategory === category
                    ? 'bg-sky-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {visibleMaterials.map(material => (
              <button
                key={material.id}
                onClick={() => {
                  onSelect(material.id);
                  onClose();
                }}
                className="bg-gray-700 hover:bg-gray-600 rounded p-3 text-center transition-colors group"
              >
                <div className="mb-2 flex justify-center">
                  <MinecraftSpriteIcon material={material.id} size={48} />
                </div>
                <div className="text-xs text-gray-300 group-hover:text-white font-medium">
                  {material.name}
                </div>
                <div className="text-xs text-gray-500 font-mono mt-1">
                  {material.id}
                </div>
              </button>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-4">
              <button
                onClick={loadMore}
                className="minecraft-btn px-6 py-2"
              >
                加载更多 ({visibleCount} / {filteredMaterials.length})
              </button>
            </div>
          )}

          {filteredMaterials.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <p>没有找到匹配的材质</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
