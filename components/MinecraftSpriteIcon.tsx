'use client';

import { useState, useEffect, useRef } from 'react';

interface Props {
  material: string;
  size?: number;
  className?: string;
}

// 全局状态
let spriteMap: any = null;
let spriteImage: HTMLImageElement | null = null;
let isLoading = false;
let loadPromise: Promise<void> | null = null;

// 预加载精灵图和映射表
async function preloadSprite() {
  if (spriteMap && spriteImage?.complete) {
    return;
  }

  if (loadPromise) {
    return loadPromise;
  }

  isLoading = true;
  loadPromise = Promise.all([
    // 加载映射表
    fetch('/minecraft-items-map.json').then(res => res.json()),
    // 预加载精灵图
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = '/minecraft-items-sprite.png';
    })
  ]).then(([map, img]) => {
    spriteMap = map;
    spriteImage = img;
    isLoading = false;
    console.log('✅ 精灵图加载完成:', img.width, 'x', img.height);
  }).catch(error => {
    console.error('❌ 精灵图加载失败:', error);
    isLoading = false;
  });

  return loadPromise;
}

export default function MinecraftSpriteIcon({ material, size = 32, className = '' }: Props) {
  const [isReady, setIsReady] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // 预加载精灵图
    preloadSprite().then(() => {
      if (!mountedRef.current) return;

      const itemKey = material.toLowerCase();
      const itemPos = spriteMap?.items?.[itemKey];
      
      if (itemPos) {
        setPosition({ x: itemPos.x, y: itemPos.y });
        setIsReady(true);
      } else {
        console.warn('未找到材质:', material);
        setIsReady(true);
      }
    });

    return () => {
      mountedRef.current = false;
    };
  }, [material]);

  // 加载中显示占位符
  if (!isReady || !position || !spriteMap) {
    return (
      <div
        className={`inline-flex items-center justify-center bg-gray-700 rounded ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
      </div>
    );
  }

  const scale = size / spriteMap.itemSize;

  return (
    <div
      className={`inline-block overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <div
        className="pixelated"
        style={{
          width: spriteMap.spriteSize.width * scale,
          height: spriteMap.spriteSize.height * scale,
          backgroundImage: 'url(/minecraft-items-sprite.png)',
          backgroundSize: `${spriteMap.spriteSize.width * scale}px ${spriteMap.spriteSize.height * scale}px`,
          backgroundPosition: `-${position.x * scale}px -${position.y * scale}px`,
          backgroundRepeat: 'no-repeat',
        }}
      />
    </div>
  );
}

// 导出预加载函数供外部使用
export { preloadSprite };
