'use client';

import { useRef, useState } from 'react';
import ColorPicker from './ColorPicker';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  label?: string;
}

export default function ColoredTextInput({
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 1,
  label,
}: Props) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [previewText, setPreviewText] = useState('');

  const handleColorSelect = (colorCode: string) => {
    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const newValue = value.substring(0, start) + colorCode + value.substring(end);
    
    onChange(newValue);

    // 恢复光标位置
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + colorCode.length, start + colorCode.length);
    }, 0);
  };

  // 将 Minecraft 颜色代码转换为 HTML 预览
  const renderPreview = (text: string) => {
    if (!text) return null;

    const colorMap: { [key: string]: string } = {
      '0': '#000000', '1': '#0000AA', '2': '#00AA00', '3': '#00AAAA',
      '4': '#AA0000', '5': '#AA00AA', '6': '#FFAA00', '7': '#AAAAAA',
      '8': '#555555', '9': '#5555FF', 'a': '#55FF55', 'b': '#55FFFF',
      'c': '#FF5555', 'd': '#FF55FF', 'e': '#FFFF55', 'f': '#FFFFFF',
    };

    // 如果是多行文本，分别渲染每一行
    if (multiline && text.includes('\n')) {
      const lines = text.split('\n');
      return (
        <div className="space-y-1">
          {lines.map((line, lineIndex) => (
            <div key={lineIndex}>{renderSingleLine(line, colorMap)}</div>
          ))}
        </div>
      );
    }

    return renderSingleLine(text, colorMap);
  };

  const renderSingleLine = (text: string, colorMap: { [key: string]: string }) => {
    const parts: JSX.Element[] = [];
    let currentColor = '#FFFFFF';
    let currentStyles: string[] = [];
    let buffer = '';
    let i = 0;

    const flushBuffer = () => {
      if (buffer) {
        const style: React.CSSProperties = {
          color: currentColor,
          fontWeight: currentStyles.includes('l') ? 'bold' : 'normal',
          fontStyle: currentStyles.includes('o') ? 'italic' : 'normal',
          textDecoration: [
            currentStyles.includes('m') ? 'line-through' : '',
            currentStyles.includes('n') ? 'underline' : '',
          ].filter(Boolean).join(' ') || 'none',
        };
        parts.push(
          <span key={i} style={style}>
            {buffer}
          </span>
        );
        buffer = '';
      }
    };

    while (i < text.length) {
      if (text[i] === '&' && i + 1 < text.length) {
        const code = text[i + 1].toLowerCase();
        
        if (colorMap[code]) {
          flushBuffer();
          currentColor = colorMap[code];
          currentStyles = []; // 颜色代码会重置格式
          i += 2;
          continue;
        } else if (code === 'l' || code === 'm' || code === 'n' || code === 'o') {
          flushBuffer();
          if (!currentStyles.includes(code)) {
            currentStyles.push(code);
          }
          i += 2;
          continue;
        } else if (code === 'r') {
          flushBuffer();
          currentColor = '#FFFFFF';
          currentStyles = [];
          i += 2;
          continue;
        } else if (code === 'k') {
          // 随机字符效果，简单显示为问号
          buffer += '???';
          i += 2;
          continue;
        }
      }
      
      buffer += text[i];
      i++;
    }

    flushBuffer();
    return <div className="flex flex-wrap items-center gap-1">{parts}</div>;
  };

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1 text-gray-300">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <div className="flex-1">
          <InputComponent
            ref={inputRef as any}
            type={multiline ? undefined : 'text'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={multiline ? rows : undefined}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-sky-400 focus:outline-none font-mono text-sm"
          />
          {value && (
            <div className="mt-2 p-3 bg-gray-900/50 rounded border border-gray-700">
              <div className="text-xs text-gray-500 mb-1">预览：</div>
              <div className="text-base" style={{ minHeight: '1.5em' }}>
                {renderPreview(value)}
              </div>
            </div>
          )}
        </div>
        <ColorPicker onSelect={handleColorSelect} />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        💡 使用颜色选择器插入代码，或手动输入 &amp;a、&amp;b 等
      </p>
    </div>
  );
}
