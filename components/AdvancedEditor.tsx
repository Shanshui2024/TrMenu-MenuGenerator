'use client';

import { Menu } from '@/types/menu';
import { Plus, Trash2, Code, Clock, Zap } from 'lucide-react';
import { useState } from 'react';
import ActionSelector from './ActionSelector';

interface Props {
  menu: Menu;
  setMenu: (menu: Menu) => void;
}

type AdvancedTab = 'events' | 'tasks' | 'scripts';

export default function AdvancedEditor({ menu, setMenu }: Props) {
  const [activeTab, setActiveTab] = useState<AdvancedTab>('events');

  return (
    <div className="text-gray-300">
      <h3 className="text-xl font-bold mb-4 text-sky-400">高级选项</h3>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('events')}
          className={`minecraft-btn px-3 py-2 flex items-center gap-2 ${
            activeTab === 'events' ? 'ring-2 ring-sky-400' : ''
          }`}
        >
          <Zap size={16} />
          事件
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`minecraft-btn px-3 py-2 flex items-center gap-2 ${
            activeTab === 'tasks' ? 'ring-2 ring-sky-400' : ''
          }`}
        >
          <Clock size={16} />
          任务
        </button>
        <button
          onClick={() => setActiveTab('scripts')}
          className={`minecraft-btn px-3 py-2 flex items-center gap-2 ${
            activeTab === 'scripts' ? 'ring-2 ring-sky-400' : ''
          }`}
        >
          <Code size={16} />
          脚本
        </button>
      </div>

      <div className="bg-gray-800/50 rounded p-4">
        {activeTab === 'events' && <EventsEditor menu={menu} setMenu={setMenu} />}
        {activeTab === 'tasks' && <TasksEditor menu={menu} setMenu={setMenu} />}
        {activeTab === 'scripts' && <ScriptsEditor menu={menu} setMenu={setMenu} />}
      </div>
    </div>
  );
}

function EventsEditor({ menu, setMenu }: Props) {
  const events = menu.events || { open: [], close: [] };

  const addEvent = (type: 'open' | 'close') => {
    const newEvents = { ...events };
    if (!newEvents[type]) newEvents[type] = [];
    newEvents[type]!.push('');
    setMenu({ ...menu, events: newEvents });
  };

  const updateEvent = (type: 'open' | 'close', index: number, value: string) => {
    const newEvents = { ...events };
    if (newEvents[type]) {
      newEvents[type]![index] = value;
      setMenu({ ...menu, events: newEvents });
    }
  };

  const removeEvent = (type: 'open' | 'close', index: number) => {
    const newEvents = { ...events };
    if (newEvents[type]) {
      newEvents[type] = newEvents[type]!.filter((_, i) => i !== index);
      setMenu({ ...menu, events: newEvents });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold mb-3 text-gray-200 flex items-center gap-2">
          <Zap size={18} className="text-green-400" />
          打开菜单事件 (open)
        </h4>
        <p className="text-sm text-gray-400 mb-3">菜单打开时执行的动作</p>
        <div className="space-y-2">
          {events.open?.map((action, index) => (
            <ActionSelector
              key={index}
              value={action}
              onChange={(value) => updateEvent('open', index, value)}
              onRemove={() => removeEvent('open', index)}
              placeholder="选择或输入打开事件动作"
            />
          ))}
        </div>
        <button
          onClick={() => addEvent('open')}
          className="minecraft-btn mt-2 px-4 py-2 flex items-center gap-2"
        >
          <Plus size={16} />
          添加打开事件
        </button>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-3 text-gray-200 flex items-center gap-2">
          <Zap size={18} className="text-red-400" />
          关闭菜单事件 (close)
        </h4>
        <p className="text-sm text-gray-400 mb-3">菜单关闭时执行的动作</p>
        <div className="space-y-2">
          {events.close?.map((action, index) => (
            <ActionSelector
              key={index}
              value={action}
              onChange={(value) => updateEvent('close', index, value)}
              onRemove={() => removeEvent('close', index)}
              placeholder="选择或输入关闭事件动作"
            />
          ))}
        </div>
        <button
          onClick={() => addEvent('close')}
          className="minecraft-btn mt-2 px-4 py-2 flex items-center gap-2"
        >
          <Plus size={16} />
          添加关闭事件
        </button>
      </div>

      <div className="bg-gray-900/50 rounded p-3 text-sm">
        <p className="text-gray-400 mb-2">💡 常用动作示例：</p>
        <ul className="text-gray-500 space-y-1 font-mono text-xs">
          <li>• sound: ENTITY_PLAYER_LEVELUP</li>
          <li>• command: give %player_name% diamond 1</li>
          <li>• message: &a欢迎打开菜单！</li>
          <li>• title: &b标题;&7副标题</li>
        </ul>
      </div>
    </div>
  );
}

function TasksEditor({ menu, setMenu }: Props) {
  const tasks = menu.tasks || [];

  const addTask = () => {
    const newTasks = [...tasks, { period: 20, actions: [] }];
    setMenu({ ...menu, tasks: newTasks });
  };

  const updateTaskPeriod = (index: number, period: number) => {
    const newTasks = [...tasks];
    newTasks[index].period = period;
    setMenu({ ...menu, tasks: newTasks });
  };

  const addTaskAction = (taskIndex: number) => {
    const newTasks = [...tasks];
    newTasks[taskIndex].actions.push('');
    setMenu({ ...menu, tasks: newTasks });
  };

  const updateTaskAction = (taskIndex: number, actionIndex: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[taskIndex].actions[actionIndex] = value;
    setMenu({ ...menu, tasks: newTasks });
  };

  const removeTaskAction = (taskIndex: number, actionIndex: number) => {
    const newTasks = [...tasks];
    newTasks[taskIndex].actions = newTasks[taskIndex].actions.filter((_, i) => i !== actionIndex);
    setMenu({ ...menu, tasks: newTasks });
  };

  const removeTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setMenu({ ...menu, tasks: newTasks });
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-400 mb-4">定时任务会在菜单打开时周期性执行</p>
        
        {tasks.map((task, taskIndex) => (
          <div key={taskIndex} className="bg-gray-900/50 rounded p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                <Clock size={18} className="text-sky-400" />
                任务 #{taskIndex + 1}
              </h4>
              <button
                onClick={() => removeTask(taskIndex)}
                className="minecraft-btn-danger px-3 py-2"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">执行周期 (tick)</label>
              <input
                type="number"
                value={task.period}
                onChange={(e) => updateTaskPeriod(taskIndex, parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-sky-400 focus:outline-none"
                placeholder="20 (1秒 = 20 tick)"
              />
              <p className="text-xs text-gray-500 mt-1">
                {task.period} tick = {(task.period / 20).toFixed(1)} 秒
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">执行动作</label>
              <div className="space-y-2">
                {task.actions.map((action, actionIndex) => (
                  <ActionSelector
                    key={actionIndex}
                    value={action}
                    onChange={(value) => updateTaskAction(taskIndex, actionIndex, value)}
                    onRemove={() => removeTaskAction(taskIndex, actionIndex)}
                    placeholder="选择或输入任务动作"
                  />
                ))}
              </div>
              <button
                onClick={() => addTaskAction(taskIndex)}
                className="minecraft-btn mt-2 px-3 py-2 flex items-center gap-2"
              >
                <Plus size={16} />
                添加动作
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addTask}
        className="minecraft-btn px-4 py-2 flex items-center gap-2"
      >
        <Plus size={16} />
        添加定时任务
      </button>

      <div className="bg-gray-900/50 rounded p-3 text-sm">
        <p className="text-gray-400 mb-2">💡 提示：</p>
        <ul className="text-gray-500 space-y-1 text-xs">
          <li>• 20 tick = 1 秒</li>
          <li>• 任务会在菜单打开时开始执行</li>
          <li>• 关闭菜单后任务会自动停止</li>
        </ul>
      </div>
    </div>
  );
}

function ScriptsEditor({ menu, setMenu }: Props) {
  const scripts = menu.scripts || {};
  const [newScriptName, setNewScriptName] = useState('');

  const addScript = () => {
    if (newScriptName && !scripts[newScriptName]) {
      const newScripts = { ...scripts, [newScriptName]: '' };
      setMenu({ ...menu, scripts: newScripts });
      setNewScriptName('');
    }
  };

  const updateScript = (name: string, content: string) => {
    const newScripts = { ...scripts, [name]: content };
    setMenu({ ...menu, scripts: newScripts });
  };

  const removeScript = (name: string) => {
    const { [name]: _, ...rest } = scripts;
    setMenu({ ...menu, scripts: rest });
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-400 mb-4">
          使用 JavaScript 或 Kether 脚本扩展菜单功能
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newScriptName}
            onChange={(e) => setNewScriptName(e.target.value)}
            placeholder="脚本名称 (如: myScript)"
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-sky-400 focus:outline-none"
          />
          <button
            onClick={addScript}
            className="minecraft-btn px-4 py-2 flex items-center gap-2"
            disabled={!newScriptName}
          >
            <Plus size={16} />
            添加脚本
          </button>
        </div>

        <div className="space-y-4">
          {Object.entries(scripts).map(([name, content]) => (
            <div key={name} className="bg-gray-900/50 rounded p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                  <Code size={18} className="text-purple-400" />
                  {name}
                </h4>
                <button
                  onClick={() => removeScript(name)}
                  className="minecraft-btn-danger px-3 py-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <textarea
                value={content}
                onChange={(e) => updateScript(name, e.target.value)}
                placeholder="// JavaScript 代码&#10;player.sendMessage('Hello!');"
                rows={8}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white font-mono text-sm focus:border-sky-400 focus:outline-none"
              />
            </div>
          ))}
        </div>

        {Object.keys(scripts).length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Code size={48} className="mx-auto mb-2 opacity-50" />
            <p>还没有添加脚本</p>
          </div>
        )}
      </div>

      <div className="bg-gray-900/50 rounded p-3 text-sm">
        <p className="text-gray-400 mb-2">💡 脚本示例：</p>
        <pre className="text-gray-500 font-mono text-xs overflow-x-auto">
{`// JavaScript
player.sendMessage("§a欢迎！");
player.playSound("ENTITY_PLAYER_LEVELUP");

// Kether
tell "Hello World"
sound ENTITY_PLAYER_LEVELUP`}
        </pre>
      </div>
    </div>
  );
}
