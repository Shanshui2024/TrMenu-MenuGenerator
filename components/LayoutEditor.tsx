'use client';

import { Menu } from '@/types/menu';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  menu: Menu;
  setMenu: (menu: Menu) => void;
}

export default function LayoutEditor({ menu, setMenu }: Props) {
  const currentLayout = menu.layout[menu.options.defaultLayout] || [];

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newLayout = [...menu.layout];
    const layoutCopy = [...newLayout[menu.options.defaultLayout]];
    const row = layoutCopy[rowIndex].split('');
    row[colIndex] = value || ' ';
    layoutCopy[rowIndex] = row.join('');
    newLayout[menu.options.defaultLayout] = layoutCopy;
    setMenu({ ...menu, layout: newLayout });
  };

  const addRow = () => {
    const newLayout = [...menu.layout];
    const layoutCopy = [...newLayout[menu.options.defaultLayout]];
    const width = layoutCopy[0]?.length || 9;
    layoutCopy.push(' '.repeat(width));
    newLayout[menu.options.defaultLayout] = layoutCopy;
    setMenu({ ...menu, layout: newLayout });
  };

  const removeRow = (index: number) => {
    if (currentLayout.length > 1) {
      const newLayout = [...menu.layout];
      const layoutCopy = newLayout[menu.options.defaultLayout].filter((_, i) => i !== index);
      newLayout[menu.options.defaultLayout] = layoutCopy;
      setMenu({ ...menu, layout: newLayout });
    }
  };

  return (
    <div className="text-gray-300">
      <h3 className="text-xl font-bold mb-4 text-sky-400">布局设计</h3>
      <p className="text-sm text-gray-400 mb-4">
        使用字符定义菜单布局。# 表示边框，空格表示空位，其他字符代表按钮
      </p>

      <div className="space-y-2 mb-4">
        {currentLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2 items-center">
            <div className="flex gap-1">
              {row.split('').map((cell, colIndex) => (
                <input
                  key={colIndex}
                  type="text"
                  maxLength={1}
                  value={cell}
                  onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                  className="w-10 h-10 text-center bg-gray-800 border border-gray-600 rounded text-white font-mono focus:border-sky-400 focus:outline-none"
                />
              ))}
            </div>
            <button
              onClick={() => removeRow(rowIndex)}
              className="minecraft-btn-danger p-2"
              disabled={currentLayout.length <= 1}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addRow}
        className="minecraft-btn px-4 py-2 flex items-center gap-2"
      >
        <Plus size={16} />
        添加行
      </button>
    </div>
  );
}
