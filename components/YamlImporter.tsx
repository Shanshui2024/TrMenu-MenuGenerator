'use client';

import { useState } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { Menu } from '@/types/menu';
import yaml from 'js-yaml';

interface Props {
  onImport: (menu: Menu) => void;
  onClose: () => void;
}

export default function YamlImporter({ onImport, onClose }: Props) {
  const [yamlText, setYamlText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    try {
      setError(null);
      
      // 解析 YAML
      const parsed = yaml.load(yamlText) as any;
      
      // 验证必需字段
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('无效的 YAML 格式');
      }

      // 构建菜单对象，使用默认值填充缺失字段
      const menu: Menu = {
        title: Array.isArray(parsed.title) ? parsed.title : [parsed.title || '&b我的菜单'],
        titleUpdate: parsed.titleUpdate ?? -1,
        options: {
          arguments: parsed.options?.arguments ?? false,
          defaultArguments: parsed.options?.defaultArguments ?? [],
          defaultLayout: parsed.options?.defaultLayout ?? 0,
          hidePlayerInv: parsed.options?.hidePlayerInv ?? false,
          minClickDelay: parsed.options?.minClickDelay ?? 200,
          dependExpansions: parsed.options?.dependExpansions ?? ['server', 'player'],
        },
        layout: parsed.layout ?? [['#########', '#       #', '#########']],
        playerInventory: parsed.playerInventory ?? [['         ', '         ', '         ', '         ']],
        buttons: parsed.buttons ?? {},
        bindings: {
          commands: parsed.bindings?.commands ?? [],
          items: parsed.bindings?.items,
        },
        events: parsed.events,
        tasks: parsed.tasks,
        scripts: parsed.scripts,
      };

      onImport(menu);
      onClose();
    } catch (err: any) {
      setError(err.message || '解析失败，请检查 YAML 格式');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setYamlText(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Upload size={24} />
            导入 YAML 配置
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              上传文件或粘贴 YAML 内容
            </label>
            
            <div className="mb-3">
              <label className="minecraft-btn px-4 py-2 cursor-pointer inline-flex items-center gap-2">
                <FileText size={16} />
                选择 .yml 文件
                <input
                  type="file"
                  accept=".yml,.yaml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              value={yamlText}
              onChange={(e) => setYamlText(e.target.value)}
              placeholder="粘贴 YAML 配置内容...&#10;&#10;title:&#10;  - '&b我的菜单'&#10;layout:&#10;  - ['#########']&#10;buttons:&#10;  A:&#10;    display:&#10;      material: diamond_sword"
              rows={15}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded text-white font-mono text-sm focus:border-sky-400 focus:outline-none"
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-600 rounded p-3 mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-red-400 font-semibold mb-1">导入失败</div>
                  <div className="text-red-300 text-sm">{error}</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-900/50 rounded p-4 text-sm">
            <p className="text-gray-400 mb-2">💡 使用说明：</p>
            <ul className="text-gray-500 space-y-1">
              <li>• 支持标准 TrMenu YAML 格式</li>
              <li>• 可以上传 .yml 文件或直接粘贴内容</li>
              <li>• 导入会覆盖当前所有配置</li>
              <li>• 建议先导出备份当前配置</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-2 p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleImport}
            disabled={!yamlText.trim()}
            className="flex-1 minecraft-btn px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            导入配置
          </button>
        </div>
      </div>
    </div>
  );
}
