'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Trash2, HelpCircle } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  placeholder?: string;
}

// TrMenu 动作类型定义
const ACTION_TYPES = [
  {
    category: '基础动作',
    actions: [
      { 
        id: 'command', 
        name: '执行命令', 
        template: 'command: ',
        desc: '以玩家身份执行命令',
        example: 'command: give %player_name% diamond 1'
      },
      { 
        id: 'console', 
        name: '控制台命令', 
        template: 'console: ',
        desc: '以控制台身份执行命令',
        example: 'console: give %player_name% diamond 1'
      },
      { 
        id: 'op', 
        name: 'OP命令', 
        template: 'op: ',
        desc: '临时给予OP权限执行命令',
        example: 'op: gamemode creative'
      },
      { 
        id: 'message', 
        name: '发送消息', 
        template: 'message: ',
        desc: '向玩家发送聊天消息',
        example: 'message: &a你好，%player_name%！'
      },
      { 
        id: 'broadcast', 
        name: '广播消息', 
        template: 'broadcast: ',
        desc: '向所有在线玩家广播消息',
        example: 'broadcast: &e%player_name% 打开了菜单！'
      },
      { 
        id: 'actionbar', 
        name: '动作栏消息', 
        template: 'actionbar: ',
        desc: '在动作栏显示消息',
        example: 'actionbar: &b当前金币: %vault_eco_balance%'
      },
      { 
        id: 'title', 
        name: '标题消息', 
        template: 'title: ;',
        desc: '显示标题和副标题',
        example: 'title: &b欢迎;&7Welcome'
      },
    ]
  },
  {
    category: '菜单控制',
    actions: [
      { 
        id: 'close', 
        name: '关闭菜单', 
        template: 'close',
        desc: '关闭当前菜单',
        example: 'close'
      },
      { 
        id: 'open', 
        name: '打开菜单', 
        template: 'open: ',
        desc: '打开指定菜单',
        example: 'open: shop_menu'
      },
      { 
        id: 'refresh', 
        name: '刷新菜单', 
        template: 'refresh',
        desc: '刷新当前菜单',
        example: 'refresh'
      },
    ]
  },
  {
    category: '音效与特效',
    actions: [
      { 
        id: 'sound', 
        name: '播放音效', 
        template: 'sound: ',
        desc: '播放音效',
        example: 'sound: ENTITY_PLAYER_LEVELUP'
      },
      { 
        id: 'particle', 
        name: '播放粒子', 
        template: 'particle: ',
        desc: '在玩家位置播放粒子效果',
        example: 'particle: FLAME'
      },
    ]
  },
  {
    category: '传送与移动',
    actions: [
      { 
        id: 'teleport', 
        name: '传送玩家', 
        template: 'teleport: ',
        desc: '传送玩家到指定坐标或世界',
        example: 'teleport: world,0,64,0'
      },
      { 
        id: 'connect', 
        name: '连接服务器', 
        template: 'connect: ',
        desc: 'BungeeCord - 连接到其他服务器',
        example: 'connect: lobby'
      },
    ]
  },
  {
    category: '条件与延迟',
    actions: [
      { 
        id: 'delay', 
        name: '延迟执行', 
        template: 'delay: ',
        desc: '延迟指定tick后执行下一个动作',
        example: 'delay: 20'
      },
      { 
        id: 'condition', 
        name: '条件判断', 
        template: 'condition: ',
        desc: '满足条件时执行',
        example: 'condition: %player_level% >= 10'
      },
      { 
        id: 'catch', 
        name: '捕获异常', 
        template: 'catch: ',
        desc: '捕获并处理错误',
        example: 'catch: message: &c发生错误'
      },
    ]
  },
  {
    category: '其他',
    actions: [
      { 
        id: 'js', 
        name: 'JavaScript', 
        template: 'js: ',
        desc: '执行JavaScript代码',
        example: 'js: player.sendMessage("Hello")'
      },
      { 
        id: 'kether', 
        name: 'Kether脚本', 
        template: 'kether: ',
        desc: '执行Kether脚本',
        example: 'kether: tell "Hello World"'
      },
      { 
        id: 'take', 
        name: '扣除物品', 
        template: 'take: ',
        desc: '从玩家背包扣除物品',
        example: 'take: diamond 10'
      },
      { 
        id: 'give', 
        name: '给予物品', 
        template: 'give: ',
        desc: '给予玩家物品',
        example: 'give: diamond 10'
      },
    ]
  },
];

export default function ActionSelector({ value, onChange, onRemove, placeholder }: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAction = (action: typeof ACTION_TYPES[0]['actions'][0]) => {
    onChange(action.template);
    setShowDropdown(false);
  };

  const getCurrentActionInfo = () => {
    const actionType = value.split(':')[0].trim();
    for (const category of ACTION_TYPES) {
      const action = category.actions.find(a => a.id === actionType);
      if (action) return action;
    }
    return null;
  };

  const currentAction = getCurrentActionInfo();

  return (
    <div className="flex gap-2 items-start">
      <div className="flex-1 relative" ref={dropdownRef}>
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "选择动作类型或手动输入"}
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white font-mono text-sm focus:border-sky-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 hover:border-sky-400 transition-colors"
            title="选择动作类型"
          >
            <ChevronDown size={18} className="text-gray-300" />
          </button>
          {currentAction && (
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 hover:border-sky-400 transition-colors"
              title="查看帮助"
            >
              <HelpCircle size={18} className="text-gray-300" />
            </button>
          )}
        </div>

        {showDropdown && (
          <div className="absolute left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl border-2 border-gray-700 z-50 max-h-96 overflow-y-auto">
            {ACTION_TYPES.map((category) => (
              <div key={category.category} className="p-2">
                <div className="text-xs font-semibold text-gray-400 px-2 py-1">
                  {category.category}
                </div>
                {category.actions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleSelectAction(action)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded transition-colors"
                  >
                    <div className="text-white text-sm font-medium">
                      {action.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {action.desc}
                    </div>
                    <div className="text-xs text-sky-400 font-mono mt-1">
                      {action.example}
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {showHelp && currentAction && (
          <div className="absolute left-0 right-0 mt-2 bg-gray-900 rounded-lg shadow-xl border-2 border-sky-600 p-4 z-50">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-white font-semibold">{currentAction.name}</h4>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-2">{currentAction.desc}</p>
            <div className="bg-gray-800 rounded p-2">
              <div className="text-xs text-gray-500 mb-1">示例：</div>
              <code className="text-xs text-sky-400 font-mono">
                {currentAction.example}
              </code>
            </div>
          </div>
        )}
      </div>

      {onRemove && (
        <button
          onClick={onRemove}
          className="minecraft-btn-danger px-3 py-2"
          title="删除"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
