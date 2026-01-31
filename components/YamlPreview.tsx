'use client';

import { Menu } from '@/types/menu';
import { Copy, Download } from 'lucide-react';
import { useState } from 'react';
import yaml from 'js-yaml';

interface Props {
  menu: Menu;
}

export default function YamlPreview({ menu }: Props) {
  const [copied, setCopied] = useState(false);

  const generateYaml = () => {
    return yaml.dump(menu, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
    });
  };

  const yamlContent = generateYaml();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(yamlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadYaml = () => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu.yml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="minecraft-panel p-6 h-fit sticky top-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-sky-400">YAML 预览</h2>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="minecraft-btn px-3 py-2 flex items-center gap-2"
            title="复制到剪贴板"
          >
            <Copy size={16} />
            {copied ? '已复制!' : '复制'}
          </button>
          <button
            onClick={downloadYaml}
            className="minecraft-btn px-3 py-2 flex items-center gap-2"
            title="下载 YAML 文件"
          >
            <Download size={16} />
            下载
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-[600px]">
        <pre className="text-sm text-green-400 font-mono">
          <code>{yamlContent}</code>
        </pre>
      </div>
    </div>
  );
}
