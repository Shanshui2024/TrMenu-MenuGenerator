'use client';

import { Menu } from '@/types/menu';
import { Plus, Trash2 } from 'lucide-react';
import ColoredTextInput from './ColoredTextInput';

interface Props {
  menu: Menu;
  setMenu: (menu: Menu) => void;
}

export default function BasicSettings({ menu, setMenu }: Props) {
  const updateTitle = (index: number, value: string) => {
    const newTitles = [...menu.title];
    newTitles[index] = value;
    setMenu({ ...menu, title: newTitles });
  };

  const addTitle = () => {
    setMenu({ ...menu, title: [...menu.title, '&b新标题'] });
  };

  const removeTitle = (index: number) => {
    if (menu.title.length > 1) {
      setMenu({ ...menu, title: menu.title.filter((_, i) => i !== index) });
    }
  };

  return (
    <div className="text-gray-300">
      <h3 className="text-xl font-bold mb-4 text-sky-400">基础设置</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">菜单标题</label>
          <div className="space-y-2">
            {menu.title.map((title, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <ColoredTextInput
                    value={title}
                    onChange={(value) => updateTitle(index, value)}
                    placeholder="&b菜单标题"
                  />
                </div>
                <button
                  onClick={() => removeTitle(index)}
                  className="minecraft-btn-danger px-3 py-2 mt-0"
                  disabled={menu.title.length <= 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addTitle}
            className="minecraft-btn mt-2 px-4 py-2 flex items-center gap-2"
          >
            <Plus size={16} />
            添加标题
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">标题更新间隔 (tick)</label>
          <input
            type="number"
            value={menu.titleUpdate}
            onChange={(e) => setMenu({ ...menu, titleUpdate: parseInt(e.target.value) })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-sky-400 focus:outline-none"
            placeholder="-1 表示不更新"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">最小点击延迟 (ms)</label>
          <input
            type="number"
            value={menu.options.minClickDelay}
            onChange={(e) =>
              setMenu({
                ...menu,
                options: { ...menu.options, minClickDelay: parseInt(e.target.value) },
              })
            }
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-sky-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="hidePlayerInv"
            checked={menu.options.hidePlayerInv}
            onChange={(e) =>
              setMenu({
                ...menu,
                options: { ...menu.options, hidePlayerInv: e.target.checked },
              })
            }
            className="w-4 h-4"
          />
          <label htmlFor="hidePlayerInv" className="text-sm">隐藏玩家背包</label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">依赖变量扩展</label>
          <input
            type="text"
            value={menu.options.dependExpansions.join(', ')}
            onChange={(e) =>
              setMenu({
                ...menu,
                options: {
                  ...menu.options,
                  dependExpansions: e.target.value.split(',').map((s) => s.trim()),
                },
              })
            }
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-sky-400 focus:outline-none"
            placeholder="server, player"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">绑定命令</label>
          <div className="space-y-2">
            {menu.bindings.commands.map((cmd, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={cmd}
                  onChange={(e) => {
                    const newCommands = [...menu.bindings.commands];
                    newCommands[index] = e.target.value;
                    setMenu({
                      ...menu,
                      bindings: { ...menu.bindings, commands: newCommands },
                    });
                  }}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-sky-400 focus:outline-none"
                  placeholder="menu"
                />
                <button
                  onClick={() => {
                    const newCommands = menu.bindings.commands.filter((_, i) => i !== index);
                    setMenu({
                      ...menu,
                      bindings: { ...menu.bindings, commands: newCommands },
                    });
                  }}
                  className="minecraft-btn-danger px-3 py-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() =>
              setMenu({
                ...menu,
                bindings: { ...menu.bindings, commands: [...menu.bindings.commands, 'newcmd'] },
              })
            }
            className="minecraft-btn mt-2 px-4 py-2 flex items-center gap-2"
          >
            <Plus size={16} />
            添加命令
          </button>
        </div>
      </div>
    </div>
  );
}