'use client';

import { useState, useEffect } from 'react';
import MenuBuilder from '@/components/MenuBuilder';
import YamlPreview from '@/components/YamlPreview';
import YamlImporter from '@/components/YamlImporter';
import { Menu } from '@/types/menu';
import { preloadSprite } from '@/components/MinecraftSpriteIcon';
import SpriteLoadingIndicator from '@/components/SpriteLoadingIndicator';
import { Upload } from 'lucide-react';

export default function Home() {
  const [showImporter, setShowImporter] = useState(false);
  const [menu, setMenu] = useState<Menu>({
    title: ['&b我的菜单'],
    titleUpdate: -1,
    options: {
      arguments: false,
      defaultArguments: [],
      defaultLayout: 0,
      hidePlayerInv: false,
      minClickDelay: 200,
      dependExpansions: ['server', 'player']
    },
    layout: [
      ['#########', '#       #', '#       #', '#       #', '#########']
    ],
    playerInventory: [
      ['         ', '         ', '         ', '         ']
    ],
    buttons: {},
    bindings: {
      commands: []
    }
  });

  // 页面加载时立即预加载精灵图
  useEffect(() => {
    preloadSprite();
  }, []);

  const handleImport = (importedMenu: Menu) => {
    setMenu(importedMenu);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <SpriteLoadingIndicator />
      
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold text-sky-600 mb-2 drop-shadow-lg">
          ⛏️ TrMenu 生成器
        </h1>
        <p className="text-gray-700 text-lg mb-4">
          为 Minecraft 服务器可视化创建 TrMenu 菜单配置
        </p>
        <button
          onClick={() => setShowImporter(true)}
          className="minecraft-btn px-6 py-3 flex items-center gap-2 mx-auto"
        >
          <Upload size={20} />
          导入 YAML 配置
        </button>
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        <MenuBuilder menu={menu} setMenu={setMenu} />
        <YamlPreview menu={menu} />
      </div>

      {showImporter && (
        <YamlImporter
          onImport={handleImport}
          onClose={() => setShowImporter(false)}
        />
      )}

      <footer className="mt-12 text-center text-gray-600 text-sm">
        <p>基于 TrMenu 插件 | 支持 Minecraft 1.8-1.16+</p>
        <br />
        <p>© 2025-{new Date().getFullYear()} <a target='_blank' href='https://github.com/Shanshui2024/TrMenu-MenuGenerator'>TrMenu 生成器</a> | Powered By <a ></a>
        <a href="https://v3.me.shanshui.site" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
          Shanshui-山重水复
        </a>
        </p>
      </footer>
    </main>
  );
}
