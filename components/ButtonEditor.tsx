'use client';

import { Menu, Button } from '@/types/menu';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';

interface Props {
  menu: Menu;
  setMenu: (menu: Menu) => void;
}

export default function ButtonEditor({ menu, setMenu }: Props) {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [newButtonId, setNewButtonId] = useState('');

  const buttonIds = Object.keys(menu.buttons);

  const addButton = () => {
    if (newButtonId && !menu.buttons[newButtonId]) {
      const newButton: Button = {
        display: {
          material: 'STONE',
          name: '&f新按钮',
          lore: ['&7点击执行操作'],
        },
      };
      setMenu({
        ...menu,
        buttons: { ...menu.buttons, [newButtonId]: newButton },
      });
      setNewButtonId('');
      setSelectedButton(newButtonId);
    }
  };

  const removeButton = (id: string) => {
    const { [id]: _, ...rest } = menu.buttons;
    setMenu({ ...menu, buttons: rest });
    if (selectedButton === id) setSelectedButton(null);
  };

  const updateButton = (id: string, button: Button) => {
    setMenu({
      ...menu,
      buttons: { ...menu.buttons, [id]: button },
    });
  };

  return (
    <div className="text-gray-300">
      <h3 className="text-xl font-bold mb-4 text-sky-400">按钮配置</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-200">按钮列表</h4>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newButtonId}
              onChange={(e) => setNewButtonId(e.target.value)}
              placeholder="按钮 ID (如: A, B, C)"
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-sky-400 focus:outline-none"
            />
            <button
              onClick={addButton}
              className="minecraft-btn px-3 py-2"
              disabled={!newButtonId}
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-2">
            {buttonIds.map((id) => (
              <div
                key={id}
                className={`flex items-center justify-between p-3 rounded cursor-pointer ${
                  selectedButton === id
                    ? 'bg-sky-900/50 border border-sky-400'
                    : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => setSelectedButton(id)}
              >
                <span className="font-mono font-bold">{id}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeButton(id);
                  }}
                  className="minecraft-btn-danger p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          {selectedButton && menu.buttons[selectedButton] ? (
            <ButtonForm
              buttonId={selectedButton}
              button={menu.buttons[selectedButton]}
              onUpdate={(button) => updateButton(selectedButton, button)}
            />
          ) : (
            <div className="text-center text-gray-500 mt-12">
              <Edit size={48} className="mx-auto mb-2 opacity-50" />
              <p>选择一个按钮进行编辑</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ButtonFormProps {
  buttonId: string;
  button: Button;
  onUpdate: (button: Button) => void;
}

function ButtonForm({ buttonId, button, onUpdate }: ButtonFormProps) {
  const [activeSection, setActiveSection] = useState<'display' | 'actions'>('display');

  const updateDisplay = (field: keyof Button['display'], value: any) => {
    onUpdate({
      ...button,
      display: { ...button.display, [field]: value },
    });
  };

  const updateActions = (clickType: string, actions: string[]) => {
    const newActions = { ...(button.actions || {}) };
    if (actions.length === 0) {
      delete newActions[clickType];
    } else {
      newActions[clickType] = actions;
    }
    onUpdate({ ...button, actions: newActions });
  };

  const addAction = (clickType: string) => {
    const currentActions = button.actions?.[clickType] || [];
    updateActions(clickType, [...currentActions, '']);
  };

  const updateAction = (clickType: string, index: number, value: string) => {
    const currentActions = button.actions?.[clickType] || [];
    const newActions = [...currentActions];
    newActions[index] = value;
    updateActions(clickType, newActions);
  };

  const removeAction = (clickType: string, index: number) => {
    const currentActions = button.actions?.[clickType] || [];
    updateActions(clickType, currentActions.filter((_, i) => i !== index));
  };

  const clickTypes = [
    { id: 'all', label: '所有点击' },
    { id: 'left', label: '左键' },
    { id: 'right', label: '右键' },
    { id: 'shift_left', label: 'Shift+左键' },
    { id: 'shift_right', label: 'Shift+右键' },
    { id: 'middle', label: '中键' },
  ];

  return (
    <div>
      <h4 className="text-lg font-semibold mb-3 text-gray-200">
        编辑按钮: <span className="text-sky-400">{buttonId}</span>
      </h4>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveSection('display')}
          className={`minecraft-btn px-3 py-2 flex-1 ${
            activeSection === 'display' ? 'ring-2 ring-sky-400' : ''
          }`}
        >
          显示设置
        </button>
        <button
          onClick={() => setActiveSection('actions')}
          className={`minecraft-btn px-3 py-2 flex-1 ${
            activeSection === 'actions' ? 'ring-2 ring-sky-400' : ''
          }`}
        >
          点击动作
        </button>
      </div>

      {activeSection === 'display' ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">材质</label>
            <input
              type="text"
              value={button.display.material as string}
              onChange={(e) => updateDisplay('material', e.target.value)}
              placeholder="STONE"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-sky-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">名称</label>
            <input
              type="text"
              value={button.display.name as string || ''}
              onChange={(e) => updateDisplay('name', e.target.value)}
              placeholder="&f按钮名称"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-sky-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">描述 (Lore)</label>
            <textarea
              value={(button.display.lore as string[] || []).join('\n')}
              onChange={(e) => updateDisplay('lore', e.target.value.split('\n'))}
              placeholder="&7第一行&#10;&7第二行"
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-sky-400 focus:outline-none font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">数量</label>
            <input
              type="number"
              value={button.display.amount as number || 1}
              onChange={(e) => updateDisplay('amount', parseInt(e.target.value))}
              min={1}
              max={64}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-sky-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="shiny"
              checked={button.display.shiny || false}
              onChange={(e) => updateDisplay('shiny', e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="shiny" className="text-sm">附魔光效</label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">槽位 (可选)</label>
            <input
              type="text"
              value={button.display.slots as string || ''}
              onChange={(e) => updateDisplay('slots', e.target.value)}
              placeholder="0-8 或 10,11,12"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-sky-400 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">留空则使用布局中的位置</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {clickTypes.map((clickType) => {
            const actions = button.actions?.[clickType.id] || [];
            return (
              <div key={clickType.id} className="bg-gray-900/50 rounded p-3">
                <h5 className="text-sm font-semibold mb-2 text-gray-300">
                  {clickType.label}
                </h5>
                <div className="space-y-2">
                  {actions.map((action, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={action}
                        onChange={(e) => updateAction(clickType.id, index, e.target.value)}
                        placeholder="command: say Hello"
                        className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white font-mono text-xs focus:border-sky-400 focus:outline-none"
                      />
                      <button
                        onClick={() => removeAction(clickType.id, index)}
                        className="minecraft-btn-danger px-2 py-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addAction(clickType.id)}
                  className="minecraft-btn mt-2 px-2 py-1 flex items-center gap-1 text-xs"
                >
                  <Plus size={12} />
                  添加动作
                </button>
              </div>
            );
          })}

          <div className="bg-gray-900/50 rounded p-3 text-xs">
            <p className="text-gray-400 mb-2">💡 常用动作：</p>
            <ul className="text-gray-500 space-y-1 font-mono">
              <li>• command: give %player_name% diamond 1</li>
              <li>• close</li>
              <li>• sound: ENTITY_PLAYER_LEVELUP</li>
              <li>• message: &a你点击了按钮！</li>
              <li>• open: other_menu</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
