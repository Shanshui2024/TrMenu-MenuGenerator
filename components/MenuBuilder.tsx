'use client';

import { Menu } from '@/types/menu';
import { Plus, Settings, Grid3x3, Package } from 'lucide-react';
import { useState } from 'react';
import BasicSettings from './BasicSettings';
import LayoutEditor from './LayoutEditor';
import ButtonEditor from './ButtonEditor';
import AdvancedEditor from './AdvancedEditor';

interface Props {
  menu: Menu;
  setMenu: (menu: Menu) => void;
}

type Tab = 'basic' | 'layout' | 'buttons' | 'advanced';

export default function MenuBuilder({ menu, setMenu }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('basic');

  const tabs = [
    { id: 'basic' as Tab, label: '基础设置', icon: Settings },
    { id: 'layout' as Tab, label: '布局设计', icon: Grid3x3 },
    { id: 'buttons' as Tab, label: '按钮配置', icon: Package },
    { id: 'advanced' as Tab, label: '高级选项', icon: Plus },
  ];

  return (
    <div className="minecraft-panel p-6 h-fit">
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`minecraft-btn px-4 py-2 flex items-center gap-2 ${
              activeTab === tab.id ? 'ring-2 ring-sky-400' : ''
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-900/50 rounded p-6 min-h-[500px]">
        {activeTab === 'basic' && <BasicSettings menu={menu} setMenu={setMenu} />}
        {activeTab === 'layout' && <LayoutEditor menu={menu} setMenu={setMenu} />}
        {activeTab === 'buttons' && <ButtonEditor menu={menu} setMenu={setMenu} />}
        {activeTab === 'advanced' && <AdvancedEditor menu={menu} setMenu={setMenu} />}
      </div>
    </div>
  );
}
