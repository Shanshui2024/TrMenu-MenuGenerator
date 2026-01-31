import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrMenu 生成器 - Minecraft 菜单配置工具",
  description: "可视化创建和配置 TrMenu 插件的 YAML 菜单文件",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gradient-to-br from-sky-50 to-blue-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
