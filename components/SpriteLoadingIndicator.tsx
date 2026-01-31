'use client';

import { useState, useEffect } from 'react';

export default function SpriteLoadingIndicator() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 监听精灵图加载
    const checkSprite = setInterval(() => {
      const img = document.querySelector('img[src="/minecraft-items-sprite.png"]') as HTMLImageElement;
      if (img?.complete) {
        setIsLoading(false);
        clearInterval(checkSprite);
      }
    }, 100);

    // 超时后自动隐藏
    const timeout = setTimeout(() => {
      setIsLoading(false);
      clearInterval(checkSprite);
    }, 5000);

    return () => {
      clearInterval(checkSprite);
      clearTimeout(timeout);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
      <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">加载材质图集...</span>
    </div>
  );
}
