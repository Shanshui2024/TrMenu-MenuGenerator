'use client';

import { Menu } from '@/types/menu';
import { Plus, Trash2, Grid3x3 } from 'lucide-react';
import { useState } from 'react';
import ButtonPicker from './ButtonPicker';
import MinecraftSpriteIcon from './MinecraftSpriteIcon';

interface Props {
  menu: Menu;
  setMenu: (menu: Menu) => void;
}

export default function LayoutEditor({ menu, setMenu }: Props) {
  const [showButtonPicker, setShowButtonPicker] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  
  const currentLayout = menu.layout[menu.options.defaultLayout] || [];

  // 解析布局行，支持反引号包裹的多字符标识符
  const parseLayoutRow = (row: string): string[] => {
    const cells: string[] = [];
    let i = 0;
    while (i < row.length) {
      if (row[i] === '`') {
        // 找到反引号包裹的多字符标识符
        const endIndex = row.indexOf('`', i + 1);
        if (endIndex !== -1) {
          cells.push(row.substring(i + 1, endIndex));
          i = endIndex + 1;
        } else {
          cells.push(row[i]);
          i++;
        }
      } else {
        cells.push(row[i]);
        i++;
      }
    }
    return cells;
  };

  // 将单元格数组转换回布局字符串
  const serializeLayoutRow = (cells: string[]): string => {
    return cells.map(cell => {
      // 单个 # 或单个空格是特殊字符，不需要包裹
      if (cell === '#' || cell === ' ') {
        return cell;
      }
      // 多字符标识符需要用反引号包裹
      if (cell.length > 1) {
        return `\`${cell}\``;
      }
      // 单字符普通标识符直接返回
      return cell;
    }).join('');
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newLayout = [...menu.layout];
    const layoutCopy = [...newLayout[menu.options.defaultLayout]];
    const cells = parseLayoutRow(layoutCopy[rowIndex]);
    cells[colIndex] = value || ' ';
    layoutCopy[rowIndex] = serializeLayoutRow(cells);
    newLayout[menu.options.defaultLayout] = layoutCopy;
    setMenu({ ...menu, layout: newLayout });
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
    setShowButtonPicker(true);
  };

  const handleButtonSelect = (buttonId: string) => {
    if (selectedCell) {
      updateCell(selectedCell.row, selectedCell.col, buttonId);
    }
  };

  const handleCreateNewButton = (customId?: string) => {
    // 如果提供了自定义ID，使用它；否则自动生成
    let newId = customId || '';
    
    if (!newId) {
      // 自动生成一个新的按钮ID
      const existingIds = Object.keys(menu.buttons);
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      
      for (let char of alphabet) {
        if (!existingIds.includes(char)) {
          newId = char;
          break;
        }
      }
      
      if (!newId) {
        // 如果字母用完了，使用数字
        for (let i = 0; i < 100; i++) {
          if (!existingIds.includes(i.toString())) {
            newId = i.toString();
            break;
          }
        }
      }
    }

    if (newId && selectedCell) {
      const newButtons = {
        ...menu.buttons,
        [newId]: {
          display: {
            material: 'stone',
            name: `&f按钮 ${newId}`,
            lore: ['&7点击执行操作'],
          },
        },
      };
      setMenu({ ...menu, buttons: newButtons });
      updateCell(selectedCell.row, selectedCell.col, newId);
    }
  };

  const addRow = () => {
    const newLayout = [...menu.layout];
    const layoutCopy = [...newLayout[menu.options.defaultLayout]];
    // 计算第一行的单元格数量（而不是字符数量）
    const width = layoutCopy[0] ? parseLayoutRow(layoutCopy[0]).length : 9;
    const newCells = Array(width).fill(' ');
    layoutCopy.push(serializeLayoutRow(newCells));
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

  const getCellDisplay = (char: string) => {
    if (char === ' ') return { type: 'empty', name: '空', color: 'bg-gray-800' };
    if (char === '#') return { type: 'border', name: '#', color: 'bg-gray-900' };
    
    const button = menu.buttons[char];
    if (button) {
      const material = (button.display.material as string).toLowerCase();
      return {
        type: 'button',
        material,
        name: char,
        displayName: button.display.name || char,
        color: 'bg-sky-900/50 border-sky-600',
      };
    }
    
    return { type: 'unknown', name: char, color: 'bg-purple-900/50' };
  };

  return (
    <div className="text-gray-300">
      <h3 className="text-xl font-bold mb-4 text-sky-400 flex items-center gap-2">
        <Grid3x3 size={24} />
        布局设计
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        点击格子选择按钮。# 表示边框，空格表示空位
      </p>

      <div className="space-y-2 mb-4">
        {currentLayout.map((row, rowIndex) => {
          const cells = parseLayoutRow(row);
          return (
            <div key={rowIndex} className="flex gap-2 items-center">
              <div className="flex gap-1">
                {cells.map((cell, colIndex) => {
                  const display = getCellDisplay(cell);
                  return (
                    <button
                      key={colIndex}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      className={`w-14 h-14 ${display.color} border-2 border-gray-600 rounded hover:border-sky-400 transition-all flex flex-col items-center justify-center group relative hover:scale-105`}
                      title={`位置: [${rowIndex},${colIndex}] | 字符: ${cell}${display.displayName ? ' | ' + display.displayName : ''}`}
                    >
                      {display.type === 'button' && display.material ? (
                        <>
                          <MinecraftSpriteIcon material={display.material} size={32} />
                          <span className="text-xs text-gray-400 group-hover:text-sky-400 font-bold mt-0.5">
                            {display.name}
                          </span>
                        </>
                      ) : display.type === 'empty' ? (
                        <span className="text-2xl text-gray-600">⬜</span>
                      ) : display.type === 'border' ? (
                        <span className="text-2xl text-gray-700">⬛</span>
                      ) : (
                        <span className="text-2xl">{display.name}</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => removeRow(rowIndex)}
                className="minecraft-btn-danger p-2"
                disabled={currentLayout.length <= 1}
                title="删除这一行"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={addRow}
          className="minecraft-btn px-4 py-2 flex items-center gap-2"
        >
          <Plus size={16} />
          添加行
        </button>
      </div>

      <div className="bg-gray-900/50 rounded p-4 text-sm">
        <p className="text-gray-400 mb-2">💡 使用说明：</p>
        <ul className="text-gray-500 space-y-1">
          <li>• 点击格子打开按钮选择器</li>
          <li>• 使用 <span className="text-white font-bold">#</span> 创建边框装饰</li>
          <li>• 使用空格创建空白位置</li>
          <li>• 单字符按钮直接显示（如 A、B、1）</li>
          <li>• 多字符或包含特殊字符的按钮自动用反引号包裹（如 `oi`、`#1`）</li>
          <li>• 在"按钮配置"标签页编辑按钮属性</li>
        </ul>
      </div>

      {showButtonPicker && (
        <ButtonPicker
          menu={menu}
          onSelect={handleButtonSelect}
          onClose={() => setShowButtonPicker(false)}
          onCreateNew={handleCreateNewButton}
        />
      )}
    </div>
  );
}

