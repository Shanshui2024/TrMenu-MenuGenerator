'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Menu } from '@/types/menu';
import MinecraftSpriteIcon from './MinecraftSpriteIcon';

interface Props {
  menu: Menu;
  onSelect: (buttonId: string) => void;
  onClose: () => void;
  onCreateNew: (customId?: string) => void;
}

export default function ButtonPicker({ menu, onSelect, onClose, onCreateNew }: Props) {
  const [search, setSearch] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newButtonId, setNewButtonId] = useState('');

  const buttonIds = Object.keys(menu.buttons);
  const filteredButtons = buttonIds.filter(id => 
    id.toLowerCase().includes(search.toLowerCase())
  );

  const specialChars = [
    { id: '#', name: '边框', desc: '装饰性边框' },
    { id: ' ', name: '空位', desc: '空白位置' },
  ];

  const handleCreateNewButton = () => {
    if (newButtonId && !menu.buttons[newButtonId] && newButtonId !== '#' && newButtonId !== ' ') {
      onCreateNew(newButtonId);
      setShowCreateDialog(false);
      setNewButtonId('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">选择按钮</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-700">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索按钮 ID..."
            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded text-white focus:border-sky-400 focus:outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">特殊字符</h4>
            <div className="grid grid-cols-2 gap-2">
              {specialChars.map(char => (
                <button
                  key={char.id}
                  onClick={() => {
                    onSelect(char.id);
                    onClose();
                  }}
                  className="bg-gray-700 hover:bg-gray-600 rounded p-3 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{char.id === '#' ? '⬛' : '⬜'}</span>
                    <div>
                      <div className="text-white font-medium">{char.name}</div>
                      <div className="text-xs text-gray-400">{char.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-400">已有按钮</h4>
              <button
                onClick={() => setShowCreateDialog(true)}
                className="minecraft-btn px-3 py-1 text-xs flex items-center gap-1"
              >
                <Plus size={14} />
                新建按钮
              </button>
            </div>
            
            {filteredButtons.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredButtons.map(id => {
                  const button = menu.buttons[id];
                  const material = (button.display.material as string).toLowerCase();
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        onSelect(id);
                        onClose();
                      }}
                      className="bg-gray-700 hover:bg-gray-600 rounded p-3 text-center transition-colors"
                    >
                      <div className="mb-2 flex justify-center">
                        <MinecraftSpriteIcon material={material} size={48} />
                      </div>
                      <div className="text-white font-bold text-lg mb-1">
                        {id}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {button.display.name || material}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p className="mb-2">还没有创建按钮</p>
                <button
                  onClick={() => setShowCreateDialog(true)}
                  className="minecraft-btn px-4 py-2 flex items-center gap-2 mx-auto"
                >
                  <Plus size={16} />
                  创建第一个按钮
                </button>
              </div>
            )}
          </div>
        </div>

        {showCreateDialog && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border-2 border-sky-600">
              <h4 className="text-lg font-bold text-white mb-4">创建新按钮</h4>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  按钮标识符
                </label>
                <input
                  type="text"
                  value={newButtonId}
                  onChange={(e) => setNewButtonId(e.target.value.trim())}
                  placeholder="输入单个字符或字符串 (如: A, B, item1)"
                  maxLength={10}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded text-white focus:border-sky-400 focus:outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateNewButton();
                    } else if (e.key === 'Escape') {
                      setShowCreateDialog(false);
                      setNewButtonId('');
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 支持单字符（A、B、1）或多字符（oi、item1、#1）
                </p>
                <p className="text-xs text-gray-500">
                  多字符或包含特殊字符会自动用反引号包裹（如 `oi`、`#1`）
                </p>
                {newButtonId && !!menu.buttons[newButtonId] && (
                  <p className="text-xs text-red-400 mt-2">
                    ⚠️ 该标识符已存在
                  </p>
                )}
                {(newButtonId === '#' || newButtonId === ' ') && (
                  <p className="text-xs text-red-400 mt-2">
                    ⚠️ 该字符为保留字符
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowCreateDialog(false);
                    setNewButtonId('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateNewButton}
                  disabled={!newButtonId || !!menu.buttons[newButtonId] || newButtonId === '#' || newButtonId === ' '}
                  className="flex-1 minecraft-btn px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  创建
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
