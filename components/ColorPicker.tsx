'use client';

import { useState } from 'react';
import { Palette } from 'lucide-react';

interface Props {
  onSelect: (colorCode: string) => void;
}

// Minecraft 颜色代码映射
const MINECRAFT_COLORS = [
  { code: '0', name: '黑色', hex: '#000000' },
  { code: '1', name: '深蓝色', hex: '#0000AA' },
  { code: '2', name: '深绿色', hex: '#00AA00' },
  { code: '3', name: '深青色', hex: '#00AAAA' },
  { code: '4', name: '深红色', hex: '#AA0000' },
  { code: '5', name: '深紫色', hex: '#AA00AA' },
  { code: '6', name: '金色', hex: '#FFAA00' },
  { code: '7', name: '灰色', hex: '#AAAAAA' },
  { code: '8', name: '深灰色', hex: '#555555' },
  { code: '9', name: '蓝色', hex: '#5555FF' },
  { code: 'a', name: '绿色', hex: '#55FF55' },
  { code: 'b', name: '青色', hex: '#55FFFF' },
  { code: 'c', name: '红色', hex: '#FF5555' },
  { code: 'd', name: '粉红色', hex: '#FF55FF' },
  { code: 'e', name: '黄色', hex: '#FFFF55' },
  { code: 'f', name: '白色', hex: '#FFFFFF' },
];

const MINECRAFT_FORMATS = [
  { code: 'k', name: '随机字符', symbol: '✨' },
  { code: 'l', name: '粗体', symbol: 'B' },
  { code: 'm', name: '删除线', symbol: 'S' },
  { code: 'n', name: '下划线', symbol: 'U' },
  { code: 'o', name: '斜体', symbol: 'I' },
  { code: 'r', name: '重置', symbol: 'R' },
];

export default function ColorPicker({ onSelect }: Props) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="p-2 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 hover:border-sky-400 transition-colors"
        title="选择颜色"
      >
        <Palette size={18} className="text-gray-300" />
      </button>

      {showPicker && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPicker(false)}
          />
          <div className="absolute left-0 mt-2 bg-gray-800 rounded-lg shadow-xl border-2 border-gray-700 p-4 z-50 w-80">
            <h4 className="text-sm font-semibold text-white mb-3">颜色代码</h4>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {MINECRAFT_COLORS.map((color) => (
                <button
                  key={color.code}
                  onClick={() => {
                    onSelect(`&${color.code}`);
                    setShowPicker(false);
                  }}
                  className="group relative p-2 rounded hover:ring-2 hover:ring-sky-400 transition-all"
                  style={{ backgroundColor: color.hex }}
                  title={`&${color.code} - ${color.name}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-white bg-black/70 px-2 py-1 rounded">
                      &{color.code}
                    </span>
                  </div>
                  <div className="h-8" />
                </button>
              ))}
            </div>

            <h4 className="text-sm font-semibold text-white mb-3">格式代码</h4>
            <div className="grid grid-cols-3 gap-2">
              {MINECRAFT_FORMATS.map((format) => (
                <button
                  key={format.code}
                  onClick={() => {
                    onSelect(`&${format.code}`);
                    setShowPicker(false);
                  }}
                  className="bg-gray-700 hover:bg-gray-600 rounded p-2 text-center transition-colors group"
                  title={`&${format.code} - ${format.name}`}
                >
                  <div className="text-2xl mb-1">{format.symbol}</div>
                  <div className="text-xs text-gray-400 group-hover:text-white">
                    &{format.code}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">
                💡 点击颜色或格式代码插入到光标位置
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
